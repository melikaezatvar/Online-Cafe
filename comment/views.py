from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Comment, Reaction
from .serializer import CommentSerializer
from django.db.models import Count, Q


class CommentManagementAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        if 'product_id' in kwargs:
            main_comment = Comment.objects.filter(product_id=kwargs.get('product_id'), is_active=True, reply_comment=None).annotate(
                like_count=Count('reaction', filter=Q(reaction__react='L'))
            ).order_by('-like_count')[:20]
            reply_comments = Comment.objects.filter(product_id=kwargs.get('product_id'), is_active=True, reply_comment__in=main_comment).order_by('create_at')
            all_comment = [*main_comment, *reply_comments]
        else:
            all_comment = Comment.objects.filter(user=request.user, is_active=True).order_by('-create_at')

        serializer = CommentSerializer(all_comment, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        print(request.data)
        if text := request.data.get('comment'):
            comment = Comment.objects.create(user=request.user, product_id=kwargs.get('product_id'),
                                             comment=text, reply_comment_id=request.data.get('reply_comment'))
            serializer = CommentSerializer(data=comment)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id, *args, **kwargs):
        Comment.objects.filter(id=comment_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReactionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id, *args, **kwargs):
        Reaction.objects.update_or_create(user=request.user, comment_id=comment_id,
                                          defaults={'react': kwargs.get('react')})
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, comment_id, *args, **kwargs):
        Reaction.objects.filter(user=request.user, comment_id=comment_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
