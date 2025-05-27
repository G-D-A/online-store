import { container } from 'tsyringe';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

container.registerSingleton(UserService, UserService);
container.registerSingleton(ProductService, ProductService);
container.registerSingleton(OrderService, OrderService);
container.registerSingleton(AuthService, AuthService);
