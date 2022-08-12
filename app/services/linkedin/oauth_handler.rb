require "linkedin/client"

class Linkedin::OauthHandler
  class Error < StandardError; end

  class BadResponseError < Error; end

  def initialize(code:)
    @code = code
  end

  def call
    retrieve_access_token!
    retrieve_email_address!

    user = User.find_by(email: email_address)
    retrieve_lite_profile!

    unless user
      user = create_user
    end

    user.update!(linkedin_id: lite_profile['id'])

    upload_profile_picture(user) if lite_profile_request.success?

    {success: true, user: user}
  rescue BadResponseError => error
    Rollbar.error(error, "Unable to handle LinkedIn OAuth")
    {success: false}
  end

  private

  attr_reader :code

  def retrieve_access_token!
    raise BadResponseError, access_token_request.body unless access_token_request.success?
  end

  def access_token_request
    @access_token_request ||= client.retrieve_access_token(code)
  end

  def client
    @client ||= ::Linkedin::Client.new
  end

  def retrieve_email_address!
    raise BadResponseError, email_address_request.body unless email_address_request.success?
  end

  def email_address_request
    @email_address_request ||= client.retrieve_email_address(access_token)
  end

  def access_token
    @access_token ||= JSON.parse(access_token_request.body)["access_token"]
  end

  def email_address
    @email_address ||=
      JSON.parse(email_address_request.body).dig("elements", 0, "handle~", "emailAddress")
  end

  def retrieve_lite_profile!
    raise BadResponseError, lite_profile_request.body unless lite_profile_request.success?
  end

  def lite_profile_request
    @lite_profile_request ||= client.retrieve_lite_profile(access_token)
  end

  def create_user
    result = Users::Create.new.call(
      display_name: display_name,
      email: email_address,
      password: nil,
      username: username
    )

    raise BadResponseError, result[:error] unless result[:success]

    result[:user].tap do |user|
      user.confirm_email
      AddUsersToMailerliteJob.perform_later(user.id)
    end
  end

  def display_name
    @display_name ||=
      lite_profile.slice("localizedFirstName", "localizedLastName").values.join(" ")
  end

  def username
    parameterized_name = display_name.parameterize(separator: "")
    return parameterized_name unless User.find_by(username: parameterized_name).present?

    "#{parameterized_name}#{(SecureRandom.random_number(9e5) + 1e5).to_i}"
  end

  def lite_profile
    @lite_profile ||= JSON.parse(lite_profile_request.body)
  end

  def upload_profile_picture(user)
    investor = user.investor
    talent = user.talent
    return unless investor || talent

    elements = lite_profile.dig("profilePicture", "displayImage~", "elements")
    return unless elements.present?

    profile_picture_url = elements.reverse.dig(0, "identifiers", 0, "identifier")
    return unless profile_picture_url

    [investor, talent].each do |record|
      next unless record
      next if record.profile_picture_url

      record.profile_picture_attacher.context[:omniauth] = true
      record.profile_picture = Down.open(profile_picture_url)
      record.save!
    end
  end

  def profile_picture_url
    elements = lite_profile.dig("profilePicture", "displayImage~", "elements")
    return unless elements.present?

    elements.reverse.dig(0, "identifiers", 0, "identifier")
  end
end
