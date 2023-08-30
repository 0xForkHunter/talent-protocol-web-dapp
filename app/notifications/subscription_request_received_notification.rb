class SubscriptionRequestReceivedNotification < BaseNotification
  deliver_by :email,
    mailer: "SubscriptionMailer",
    method: :subscription_request_email,
    delay: 3.hours,
    if: :send_email?

  def actionable?
    actions.present? && PendingSubscription.find_by(subscriber: source, user: recipient).present?
  end

  def actions
    return [] unless source

    [
      {
        hierarchy: "secondary",
        label: t(".secondary_button"),
        request_data: {data: request_data},
        request_type: "DELETE",
        url: "/api/v1/subscriptions"
      },
      {
        hierarchy: "primary",
        label: t(".button"),
        request_data:,
        request_type: "PUT",
        url: "/api/v1/subscriptions/accept"
      }
    ]
  end

  def send_email?
    # disable sending email based on notifications
    # unread? && !emailed? && recipient.pending_subscribers.any?
    false
  end

  def url
    connection_url
  end

  private

  def request_data
    {id: source.uuid, user_id: recipient.uuid}
  end
end
