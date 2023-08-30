require "rails_helper"

RSpec.describe EmailReminders::SendSubscriptionRequestEmailJob, type: :job do
  include ActiveJob::TestHelper

  let!(:user_1) { create :user }
  let!(:user_2) { create :user, talent: talent }
  let(:talent) { create :talent }

  subject(:send_subscription_request_email) { described_class.perform_now }

  it "sends email notification only to the user with pending subscriptions" do
    Sidekiq::Testing.inline! do
      create :subscription, user: user_1, subscriber: user_2, accepted_at: nil

      send_subscription_request_email

      perform_enqueued_jobs

      mail = ActionMailer::Base.deliveries.first

      aggregate_failures do
        expect(ActionMailer::Base.deliveries.count).to eq 1
        expect(mail.subject).to eq "You have new subscription requests"
      end
    end
  end

  it "sends no email notification if the subscription was a long time ago" do
    Sidekiq::Testing.inline! do
      subscription = create :subscription, user: user_1, subscriber: user_2
      subscription.update!(created_at: 26.hours.ago)

      send_subscription_request_email

      perform_enqueued_jobs

      aggregate_failures do
        expect(ActionMailer::Base.deliveries.count).to eq 0
      end
    end
  end
end
