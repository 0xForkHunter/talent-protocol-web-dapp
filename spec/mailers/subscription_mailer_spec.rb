require "rails_helper"

RSpec.describe SubscriptionMailer, type: :mailer do
  let(:user) { create :user }

  describe "#subscription_request_email" do
    let(:mail) { described_class.with(recipient_id: user.id).subscription_request_email }

    it "renders the header" do
      expect(mail.subject).to eql("You have new subscription requests")
      expect(mail.to).to eql([user.email])
    end
  end

  describe "#subscription_accepted_email" do
    let(:sender) { create :user }
    let(:mail) { described_class.with(recipient: user, source_id: sender.id).subscription_accepted_email }

    it "renders the header" do
      expect(mail.subject).to eql("Your subscription request was accepted")
      expect(mail.to).to eql([user.email])
    end
  end
end
