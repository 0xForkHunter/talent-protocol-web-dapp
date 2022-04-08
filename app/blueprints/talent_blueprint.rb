class TalentBlueprint < Blueprinter::Base
  fields :id, :profile_picture_url

  view :normal do
    fields :occupation, :headline, :user_id
    association :token, blueprint: TokenBlueprint, view: :normal
    association :user, blueprint: UserBlueprint, view: :normal

    field :is_following do |talent, options|
      options[:current_user]&.following&.where(user_id: talent.user_id)&.exists? || false
    end
  end

  view :extended do
    include_view :normal
    fields :banner_url, :profile
    association :user, blueprint: UserBlueprint, view: :extended
    association :perks, blueprint: PerkBlueprint
    association :tags, blueprint: TagBlueprint do |talent, options|
      options[:tags] || talent.user.tags
    end
    association :milestones, blueprint: MilestoneBlueprint, view: :normal
    association :career_goal, blueprint: CareerGoalBlueprint, view: :normal
  end

  view :short_meta do
    fields :occupation, :supporters_count, :total_supply
    association :token, blueprint: TokenBlueprint, view: :normal
    field :username do |talent, options|
      talent.user.username
    end
  end
end
