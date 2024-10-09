from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Comment, Reaction
from .serializer import CommentSerializer, ReactionSerializer
from django.db.models import Count, Q


class CommentManagementAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id, *args, **kwargs):
        comments = Comment.objects.filter(product_id=product_id, is_active=True).annotate(
            like_count=Count('reaction', filter=Q(reaction__react='L'))
        ).order_by('-like_count')[:20]
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, product_id, *args, **kwargs):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, product_id=product_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id, *args, **kwargs):
        Comment.objects.filter(id=comment_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReactionAPIView(APIView):

    def post(self, request, comment_id, *args, **kwargs):
        reaction = Reaction.objects.update_or_create(user=request.user, comment_id=comment_id, defaults={'react': kwargs.get('react')})
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, comment_id, *args, **kwargs):
        Reaction.objects.filter(user=request.user, comment_id=comment_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
