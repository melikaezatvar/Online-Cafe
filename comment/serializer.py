from rest_framework import serializers
from .models import Comment, Reaction
from accounts.models import CustomerProfile


class ReplyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment', 'user']


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
    reaction = ReactionSerializer(many=True)
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomerProfile.objects.all()
    )

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
        # fields = '__all__'

