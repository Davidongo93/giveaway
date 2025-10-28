import axios, { AxiosResponse } from 'axios';

// Configuración base de Axios
const api = axios.create({
    baseURL: 'http://192.168.50.11:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interfaces
export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
}

export enum RaffleType {
    SMALL = 'small',    // 100 tickets
    MEDIUM = 'medium',  // 1000 tickets
    LARGE = 'large',    // 10000 tickets
}
export enum RaffleStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    CLOSED = 'closed',
    CANCELLED = 'cancelled',
    FINISHED = 'finished',
}


export interface Raffle {
    id: string;
    creatorId: string;
    raffleType: RaffleType;
    title: string;
    description: string;
    prizeImageUrl: string;
    ticketPrice: number;
    prizeValue: number;
    secondPrizeValue?: number; // Nuevo campo para segundo premio
    drawMode: DrawMode;
    drawDate: Date | null
    featured: boolean;
    tickets: boolean[];
    status: RaffleStatus;
    createdAt: string;
}
export enum DrawMode {
  APP_DRAW = 'app_draw', // Ejecutado por la aplicación
  COLOMBIAN_LOTTERY = 'colombian_lottery', // Loterías colombianas
}

export interface Ticket {
    id: string;
    raffleId: string;
    userId: string;
    number: number;
    urlComprobante: string;
    createdAt: string;
    updatedAt: string;
}

export interface BuyTicketData {
    raffleId: string;
    userId: string;
    number: number;
    urlComprobante: string;
}

export interface CreateRaffleData {
    creatorId: string;
    description: string;
    ticketPrice: number;
    prizeValue: number;
}

export interface CreateUserData {
    name: string;
    phone: string;
    email: string;
}

export interface UpdateRaffleStatusData {
    status: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

// Interceptor modificado para mayor claridad
api.interceptors.response.use(
    (response: ApiResponse<AxiosResponse>) => {
        // Devuelve directamente data.data ya que la respuesta está envuelta en ApiResponse
        console.log('API Response:', response.data);
        return response.data;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    }
);

// Servicio de Usuarios
export const UserService = {
    create: async (data: CreateUserData): Promise<User> => {
        return api.post('/users', data);
    },
    getAll: async (): Promise<User[]> => {
        return api.get('/users');
    },
    getById: async (id: string): Promise<User> => {
        return api.get(`/users/${id}`);
    },
};

// Servicio de Rifas
export const RaffleService = {
    create: async (data: CreateRaffleData): Promise<Raffle> => {
        return api.post('/raffles', data);
    },
    getAll: async (): Promise<Raffle[]> => {
        return api.get('/raffles');
    },
    getById: async (id: string): Promise<Raffle> => {
        return api.get(`/raffles/${id}`);
    },
    updateStatus: async (id: string, data: UpdateRaffleStatusData): Promise<Raffle> => {
        return api.patch(`/raffles/${id}/status`, data);
    },
};

// Servicio de Tickets
export const TicketService = {
    buy: async (data: BuyTicketData): Promise<Ticket> => {
        return api.post('/tickets/buy', data);
    },
    getByUser: async (userId: string): Promise<Ticket[]> => {
        return api.get(`/tickets/user?userId=${userId}`);
    },
};

export default api;
