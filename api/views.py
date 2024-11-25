from django.shortcuts import render
from api.models import User, Expense, Income, Bill, Wishlist, Saving
from api.serializer import ExpenseSerializer, MyTokenObtainPairSerializer, RegisterSerializer, IncomeSerializer, BillSerializer, WishlistSerializer, SavingSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer
    
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == "GET":
        response = f"Hey {request.user}, You are seeing a GET response"
        return Response({'response': response}, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        text = request.POST.get("text")
        response = f"Hey {request.user}, your text is {text}"
        return Response({'response': response}, status=status.HTTP_200_OK)
    return Response({}, status=status.HTTP_400_BAD_REQUEST)

class IncomeListView(generics.ListCreateAPIView):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(f"Logged-in user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Income.objects.filter(user=self.request.user).order_by('-date_received')
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class IncomeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()

        if obj.user != self.request.user:
            raise PermissionDenied("You don't have the permission to access this page")

        return obj
    
class ExpenseListView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(f"Logged-in user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date_spended')
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()

        if obj.user != self.request.user:
            raise PermissionDenied("You don't have the permission to access this page")

        return obj
    
class BillListView(generics.ListCreateAPIView):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(f"Logged-in user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Bill.objects.filter(user=self.request.user).order_by('-due_date')
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
class BillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()

        if obj.user != self.request.user:
            raise PermissionDenied("You don't have the permission to access this page")

        return obj
    
class WishlistListView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(f"Logged-in user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-price')
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
class WishlistDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()

        if obj.user != self.request.user:
            raise PermissionDenied("You don't have the permission to access this page")

        return obj
    
class SavingListView(generics.ListCreateAPIView):
    serializer_class = SavingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(f"Logged-in user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Saving.objects.filter(user=self.request.user).order_by('-date_saved')
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
class SavingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Saving.objects.all()
    serializer_class = SavingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()

        if obj.user != self.request.user:
            raise PermissionDenied("You don't have the permission to access this page")

        return obj
