require "rails_helper"

RSpec.describe "Profiles", type: :request do
  describe "#show" do
    subject(:get_profile) { get profile_path(username: username, as: current_user) }

    let(:user) { create :user }
    let!(:talent) { create :talent, user: user }
    let(:username) { user.username }
    let(:current_user) { user }

    context "when the current user is admin" do
      before do
        current_user.update(role: "admin")
      end

      it "returns a successful response" do
        get_profile

        expect(response).to have_http_status(:ok)
      end

      it "assigns the correct profile to be passed to the view" do
        get_profile

        expect(assigns(:profile)).to eq(ProfileBlueprint.render_as_json(talent, view: :normal))
      end
    end

    context "when the current user is not admin" do
      before do
        current_user.update(role: "basic")
      end

      it "redirects the request" do
        get_profile

        expect(response).to have_http_status(:redirect)
      end
    end
  end
end