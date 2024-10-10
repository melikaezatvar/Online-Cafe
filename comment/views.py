from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Comment, Reaction
from .serializer import CommentSerializer
from django.db.models import Count, Q


class CommentManagementAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if 'product_id' in kwargs:
            comments = Comment.objects.filter(product_id=kwargs.get('product_id'), is_active=True).annotate(
                like_count=Count('reaction', filter=Q(reaction__react='L'))
            ).order_by('-like_count')[:20]
        else:
            comments = Comment.objects.filter(user=request.user, is_active=True).order_by('-create_at')

        serializer = CommentSerializer(comments, many=True)
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
        Reaction.objects.update_or_create(user=request.user, comment_id=comment_id, defaults={'react': kwargs.get('react')})
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, comment_id, *args, **kwargs):
        Reaction.objects.filter(user=request.user, comment_id=comment_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
