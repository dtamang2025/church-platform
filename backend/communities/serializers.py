from rest_framework import serializers
from .models import Community, CommunityMember
from users.serializers import UserSerializer


class CommunityMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CommunityMember
        fields = ['id', 'user', 'role', 'joined_at']


class CommunitySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'avatar', 'owner',
                  'members_count', 'user_role', 'is_member', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']

    def get_members_count(self, obj):
        return obj.members.count()

    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                m = CommunityMember.objects.get(community=obj, user=request.user)
                return m.role
            except CommunityMember.DoesNotExist:
                return None
        return None

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommunityMember.objects.filter(community=obj, user=request.user).exists()
        return False

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user
        community = super().create(validated_data)
        CommunityMember.objects.create(community=community, user=user, role=CommunityMember.ROLE_ADMIN)
        return community
