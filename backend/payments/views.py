from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.select_related(
            "sales_order"
        ).all()

        serializer = PaymentSerializer(
            payments,
            many=True,
        )

        return Response(
            {
                "success": True,
                "payments": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = PaymentSerializer(
            data=request.data
        )

        if serializer.is_valid():
            payment = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Payment created successfully.",
                    "payment": PaymentSerializer(
                        payment
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class PaymentDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, payment_id):
        try:
            return Payment.objects.select_related(
                "sales_order"
            ).get(
                id=payment_id
            )
        except Payment.DoesNotExist:
            return None

    def get(self, request, payment_id):
        payment = self.get_object(payment_id)

        if payment is None:
            return Response(
                {
                    "success": False,
                    "message": "Payment not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PaymentSerializer(payment)

        return Response(
            {
                "success": True,
                "payment": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, payment_id):
        payment = self.get_object(payment_id)

        if payment is None:
            return Response(
                {
                    "success": False,
                    "message": "Payment not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PaymentSerializer(
            payment,
            data=request.data,
        )

        if serializer.is_valid():
            payment = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Payment updated successfully.",
                    "payment": PaymentSerializer(
                        payment
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, payment_id):
        payment = self.get_object(payment_id)

        if payment is None:
            return Response(
                {
                    "success": False,
                    "message": "Payment not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        payment.delete()

        return Response(
            {
                "success": True,
                "message": "Payment deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )