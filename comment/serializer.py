from rest_framework import serializers
from .models import Comment, Reaction
from accounts.models import CustomerProfile


class ReplyCommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomerProfile.objects.all()
    )

    class Meta:
        model = Comment
        fields = ['id', 'comment', 'user']


class ReactionSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomerProfile.objects.all()
    )

    class Meta:
        model = Reaction
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    reply_comment = ReplyCommentSerializer()
    reaction = serializers.SerializerMethodField()
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomerProfile.objects.all()
    )
    create_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

    class Meta:
        model = Comment
        fields = ['id',
                  'comment',
                  'reply_comment',
                  'reaction',
                  'user',
                  'create_at',
                  'count_like',
                  'count_dislike']

    def get_reaction(self, obj):
        request = self.context.get('request', None)
        if request is not None:
            user = request.user
            reactions = obj.reaction.filter(user=user)
            return ReactionSerializer(reactions, many=True).data
        return None
