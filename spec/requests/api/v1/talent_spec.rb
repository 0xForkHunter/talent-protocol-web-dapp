require "rails_helper"

RSpec.describe "Talent", type: :request do
  let(:current_user) { create :user }

  describe "#index" do
    let(:talents_search_class) { Talents::ChewySearch }
    let(:talents_search) { instance_double(talents_search_class, call: [{current_page: 1, last_page: 1}, Talent.all]) }

    before do
      allow(talents_search_class).to receive(:new).and_return(talents_search)
    end

    subject(:get_talents) do
      get api_v1_talent_index_path(status: "Pending approval", as: current_user)
    end

    it "initialises and calls the talents search with the correct a" do
      get_talents

      aggregate_failures do
        expect(talents_search_class).to have_received(:new)
          .with(
            admin_or_moderator: false,
            filter_params: {"status" => "Pending approval"},
            searching_user: current_user,
            discovery_row: nil,
            size: 40,
            from: 0
          )

        expect(talents_search).to have_received(:call)
      end
    end
  end

  describe "#update" do
    let!(:talent) { create :talent, user: current_user }
    subject(:update_talent_request) { put api_v1_talent_path(id: current_user.uuid, params: params, as: current_user) }

    let(:params) do
      {
        talent: {
          headline: "I'm a software engineer that wants to create a test.",
          occupation: "Software Engineer",
          open_to_job_offers: true,
          profile: {
            based_in: "New York",
            discord: "",
            ethnicity: "Native American",
            gender: "Prefer not to disclose",
            github: "https://github.com/talentprotocol",
            headline: "I'm a software engineer eager to learn more about blockchain technologies and web3.",
            linkedin: "https://www.linkedin.com",
            location: "Leiria",
            nationality: "american",
            occupation: "Software Engineer",
            website: "https://www.talentprotocol.com/"
          }
        },
        user: {
          display_name: "John Doe"
        }
      }
    end

    context "when the current user does not match the talent id passed" do
      let(:another_user) { create :user, role: role }
      let(:role) { "basic" }

      it "returns an authorization error" do
        put api_v1_talent_path(id: current_user.uuid, params: params, as: another_user)

        expect(response).to have_http_status(:unauthorized)
      end

      it "renders the appropriate error message" do
        put api_v1_talent_path(id: current_user.uuid, params: params, as: another_user)

        expect(json).to eq(
          {
            error: "You don't have access to perform that action"
          }
        )
      end

      context "when the current user is an admin" do
        let(:role) { "admin" }

        it "returns a successful response" do
          put api_v1_talent_path(id: current_user.uuid, params: params, as: another_user)

          expect(response).to have_http_status(:ok)
        end
      end

      context "when the current user is a moderator" do
        let(:role) { "moderator" }

        it "returns a successful response" do
          put api_v1_talent_path(id: current_user.uuid, params: params, as: another_user)

          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "when the params are all valid" do
      it "returns a successful response" do
        update_talent_request

        expect(response).to have_http_status(:ok)
      end

      it "updates the user" do
        update_talent_request

        current_user.reload

        aggregate_failures do
          expect(current_user.display_name).to eq "John Doe"
        end
      end

      it "updates the talent" do
        update_talent_request

        talent.reload

        aggregate_failures do
          expect(talent.based_in).to eq "New York"
          expect(talent.discord).to eq ""
          expect(talent.ethnicity).to eq "Native American"
          expect(talent.gender).to eq "Prefer not to disclose"
          expect(talent.github).to eq "https://github.com/talentprotocol"
          expect(talent.headline).to eq "I'm a software engineer eager to learn more about blockchain technologies and web3."
          expect(talent.linkedin).to eq "https://www.linkedin.com"
          expect(talent.location).to eq "Leiria"
          expect(talent.nationality).to eq "american"
          expect(talent.occupation).to eq "Software Engineer"
          expect(talent.website).to eq "https://www.talentprotocol.com/"
          expect(talent.open_to_job_offers).to eq true
        end
      end
    end

    context "when the param is an empty string" do
      let!(:talent) { create :talent, user: current_user, profile: {github: "https://github.com/talentprotocol"} }
      subject(:update_talent_request) { put api_v1_talent_path(id: current_user.uuid, params: params, as: current_user) }

      let(:params) do
        {
          talent: {
            profile: {
              github: ""
            }
          },
          user: {
            display_name: "John Doe"
          }
        }
      end

      it "removes the param from the talent" do
        update_talent_request

        talent.reload
        expect(talent.github).to eq ""
      end
    end
  end
end
