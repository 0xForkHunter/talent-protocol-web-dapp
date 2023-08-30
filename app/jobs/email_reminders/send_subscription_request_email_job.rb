module EmailReminders
  class SendSubscriptionRequestEmailJob < ApplicationJob
    queue_as :default

    def perform
      PendingSubscription.where("created_at > ?", 25.hours.ago).distinct.pluck(:user_id).each do |user_with_pending_subscriptions|
        SubscriptionMailer
          .with(recipient_id: user_with_pending_subscriptions)
          .subscription_request_email
          .deliver_later
      end
    end
  end
end
