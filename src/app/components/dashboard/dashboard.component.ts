import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/auth.model';

interface ProtectedData {
  message: string;
  data: {
    timestamp: string;
    user: string;
    secretData: string;
  };
}

interface AdminData {
  message: string;
  data: {
    users: User[];
    stats: {
      totalUsers: number;
      activeTokens: number;
    };
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  protectedData: ProtectedData | null = null;
  adminData: AdminData | null = null;
  loading = false;
  error = '';

  private readonly API_URL = 'http://localhost:3001/api';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserValue();

    // Suscribirse a cambios en el usuario
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  loadProtectedData(): void {
    this.loading = true;
    this.error = '';

    this.http.get<ProtectedData>(`${this.API_URL}/protected/data`).subscribe({
      next: (data) => {
        this.protectedData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar datos protegidos';
        this.loading = false;
      },
    });
  }

  loadAdminData(): void {
    if (this.currentUser?.role !== 'admin') {
      this.error = 'No tienes permisos de administrador';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.get<AdminData>(`${this.API_URL}/protected/admin`).subscribe({
      next: (data) => {
        this.adminData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar datos de administrador';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Aún así redirigir al login
        this.router.navigate(['/login']);
      },
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
