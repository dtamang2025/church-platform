from rest_framework import serializers
from .models import Post
from users.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    reactions_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'community', 'title', 'description', 'lyrics',
                  'tags', 'language', 'visibility', 'reactions_count', 'user_reaction',
                  'is_saved', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_reactions_count(self, obj):
        from reactions.models import Reaction
        counts = {}
        for r in Reaction.objects.filter(post=obj).values('reaction_type'):
            rt = r['reaction_type']
            counts[rt] = counts.get(rt, 0) + 1
        return counts

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from reactions.models import Reaction
            try:
                r = Reaction.objects.get(post=obj, user=request.user)
                return r.reaction_type
            except Reaction.DoesNotExist:
                return None
        return None

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from saves.models import SavedPost
            return SavedPost.objects.filter(post=obj, user=request.user).exists()
        return False

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
