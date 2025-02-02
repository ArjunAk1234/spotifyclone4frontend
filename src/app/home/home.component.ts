
// // // // // // // import { Component, OnInit } from '@angular/core';
// // // // // // // import { AuthService } from '../auth.services';
// // // // // // // import { Router } from '@angular/router';

// // // // // // // @Component({
// // // // // // //   selector: 'app-home',
// // // // // // //   templateUrl: './home.component.html',
// // // // // // //   styleUrls: ['./home.component.css'],
// // // // // // // })
// // // // // // // export class HomeComponent implements OnInit {
// // // // // // //   isLoggedIn = false;
// // // // // // //   username = '';

// // // // // // //   constructor(private authService: AuthService, private router: Router) {}

// // // // // // //   ngOnInit(): void {
// // // // // // //     // Subscribe to login state changes
// // // // // // //     this.authService.loggedIn$.subscribe((state) => {
// // // // // // //       this.isLoggedIn = state;
// // // // // // //       if (state) {
// // // // // // //         this.username = this.authService.getUsername() || 'User'; // Retrieve the username dynamically
// // // // // // //       }
// // // // // // //     });
// // // // // // //   }

// // // // // // //   logout(): void {
// // // // // // //     this.authService.logout();
// // // // // // //     this.router.navigate(['/']); // Redirect to home page
// // // // // // //   }

// // // // // // //   goToWeatherPage(): void {
// // // // // // //     this.router.navigate(['/weather']); // Navigate to weather page
// // // // // // //   }
// // // // // // // }
// // // // // // import { Component, OnInit } from '@angular/core';
// // // // // // import { AuthService } from '../auth.services';
// // // // // // import { Router } from '@angular/router';
// // // // // // import { HttpClient } from '@angular/common/http';
// // // // // //   // Import Song model

// // // // // // @Component({
// // // // // //   selector: 'app-home',
// // // // // //   templateUrl: './home.component.html',
// // // // // //   styleUrls: ['./home.component.css'],
// // // // // // })
// // // // // // export class HomeComponent implements OnInit {
// // // // // //   isLoggedIn = false;
// // // // // //   username = '';
// // // // // //   songs: Song[] = [];  // Use the Song type for the songs array
// // // // // //   currentSong: Song | null = null;
// // // // // //   audio = new Audio();

// // // // // //   constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

// // // // // //   ngOnInit(): void {
// // // // // //     this.authService.loggedIn$.subscribe((state) => {
// // // // // //       this.isLoggedIn = state;
    
// // // // // //         this.username = this.authService.getUsername() || 'User';
      
// // // // // //     });

// // // // // //     // Fetch songs from backend with the Song type
// // // // // //     this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
// // // // // //       next: (data) => {
// // // // // //         this.songs = data;
// // // // // //       },
// // // // // //       error: (err) => {
// // // // // //         console.error('Error fetching songs:', err);
// // // // // //       },
// // // // // //       complete: () => {
// // // // // //         console.log('Songs fetch complete');
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   logout(): void {
// // // // // //     localStorage.clear();
// // // // // //     this.authService.logout();
// // // // // //     this.router.navigate(['/']); // Redirect to home page
// // // // // //   }

// // // // // //   goToWeatherPage(): void {
// // // // // //     this.router.navigate(['/weather']); // Navigate to weather page
// // // // // //   }

// // // // // //   playSong(song: any): void {
// // // // // //     if (this.currentSong && this.currentSong._id === song._id) {
// // // // // //       this.audio.pause();
// // // // // //       this.currentSong = null;
// // // // // //     } else {
// // // // // //       // Update the audio URL to use the server path
// // // // // //       this.audio.src = `http://localhost:3000/${song.url}`;  // Change this line
// // // // // //       this.audio.play();
// // // // // //       this.currentSong = song;
// // // // // //     }
// // // // // //   }
  
// // // // // // }

// // // // // // export interface Song {
// // // // // //   _id: string;
// // // // // //   title: string;
// // // // // //   artist: string;
// // // // // //   genre: string;
// // // // // //   url: string;
// // // // // //   albumCover: string;
// // // // // // }import { Component, OnInit } from '@angular/core';
// // // // // import { AuthService } from '../auth.services';
// // // // // import { Router } from '@angular/router';
// // // // // import { HttpClient } from '@angular/common/http';
// // // // // import { Component, OnInit } from '@angular/core';
// // // // //   // Import Song model

// // // // // @Component({
// // // // //   selector: 'app-home',
// // // // //   templateUrl: './home.component.html',
// // // // //   styleUrls: ['./home.component.css'],
// // // // // })
// // // // // export class HomeComponent implements OnInit {
// // // // //   isLoggedIn = false;
// // // // //   username = '';
// // // // //   songs: Song[] = [];  // Use the Song type for the songs array
// // // // //   currentSong: Song | null = null;
// // // // //   audio = new Audio();

// // // // //   constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

// // // // //   ngOnInit(): void {
// // // // //     this.authService.loggedIn$.subscribe((state) => {
// // // // //       this.isLoggedIn = state;
// // // // //       if (state) {
// // // // //         this.username = this.authService.getUsername() || 'User';
// // // // //       }
// // // // //     });

// // // // //     // Fetch songs from backend with the Song type
// // // // //     this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
// // // // //       next: (data) => {
// // // // //         this.songs = data;
// // // // //       },
// // // // //       error: (err) => {
// // // // //         console.error('Error fetching songs:', err);
// // // // //       },
// // // // //       complete: () => {
// // // // //         console.log('Songs fetch complete');
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   logout(): void {
// // // // //     this.authService.logout();
// // // // //     this.router.navigate(['/']); // Redirect to home page
// // // // //   }

// // // // //   goToWeatherPage(): void {
// // // // //     this.router.navigate(['/weather']); // Navigate to weather page
// // // // //   }

// // // // //   playSong(song: any): void {
// // // // //     if (this.currentSong && this.currentSong._id === song._id) {
// // // // //       this.audio.pause();
// // // // //       this.currentSong = null;
// // // // //     } else {
// // // // //       // Update the audio URL to use the server path
// // // // //       this.audio.src = `http://localhost:3000/${song.url}`;  // Change this line
// // // // //       this.audio.play();
// // // // //       this.currentSong = song;
// // // // //     }
// // // // //   }
  
// // // // // }

// // // // // export interface Song {
// // // // //   _id: string;
// // // // //   title: string;
// // // // //   artist: string;
// // // // //   genre: string;
// // // // //   url: string;
// // // // //   albumCover: string;
// // // // // }
// // // // import { AuthService } from '../auth.services';
// // // // import { Router } from '@angular/router';
// // // // import { HttpClient } from '@angular/common/http';
// // // // import { Component, OnInit } from '@angular/core';

// // // // // Song model interface
// // // // export interface Song {
// // // //   _id: string;
// // // //   title: string;
// // // //   artist: string;
// // // //   genre: string;
// // // //   url: string;
// // // //   albumCover: string;
// // // // }

// // // // @Component({
// // // //   selector: 'app-home',
// // // //   templateUrl: './home.component.html',
// // // //   styleUrls: ['./home.component.css'],
// // // // })
// // // // export class HomeComponent implements OnInit {
// // // //   isLoggedIn = false;
// // // //   username = '';
// // // //   songs: Song[] = [];  // Array to hold the songs
// // // //   currentSong: Song | null = null;
// // // //   audio = new Audio();  // Audio element for playing songs

// // // //   constructor(
// // // //     private authService: AuthService, 
// // // //     private router: Router, 
// // // //     private http: HttpClient
// // // //   ) {}

// // // //   ngOnInit(): void {
// // // //     // Initialize loggedIn state based on current login status
// // // //     this.authService.loggedIn$.subscribe((state) => {
// // // //       this.isLoggedIn = state;
// // // //       if (state) {
// // // //         this.username = this.authService.getUsername() || 'User';
// // // //       }
// // // //     });

// // // //     // Fetch songs from backend
// // // //     this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
// // // //       next: (data) => {
// // // //         this.songs = data;
// // // //       },
// // // //       error: (err) => {
// // // //         console.error('Error fetching songs:', err);
// // // //       },
// // // //       complete: () => {
// // // //         console.log('Songs fetch complete');
// // // //       }
// // // //     });
// // // //   }

// // // //   // Logout method to clear user session and navigate back to home
// // // //   logout(): void {
// // // //     this.authService.logout();
// // // //     this.router.navigate(['/']); // Redirect to home page after logout
// // // //   }

// // // //   // Play or pause the song based on current playback state
// // // //   playSong(song: Song): void {
// // // //     if (this.currentSong && this.currentSong._id === song._id) {
// // // //       this.audio.pause();
// // // //       this.currentSong = null;
// // // //     } else {
// // // //       // Update the audio source with the correct song URL
// // // //       this.audio.src = `http://localhost:3000/${song.url}`;
// // // //       this.audio.play();
// // // //       this.currentSong = song;
// // // //     }
// // // //   }
  
// // // // }

// // // import { Component, OnInit } from '@angular/core';
// // // import { AuthService } from '../auth.services';
// // // import { Router } from '@angular/router';
// // // import { HttpClient } from '@angular/common/http';

// // // export interface Song {
// // //   _id: string;
// // //   title: string;
// // //   artist: string;
// // //   genre: string;
// // //   url: string;
// // //   albumCover: string;
// // // }

// // // @Component({
// // //   selector: 'app-home',
// // //   templateUrl: './home.component.html',
// // //   styleUrls: ['./home.component.css'],
// // // })
// // // export class HomeComponent implements OnInit {
// // //   isLoggedIn = false;
// // //   username = '';
// // //   songs: Song[] = [];
// // //   currentSong: Song | null = null;
// // //   audio = new Audio();
// // //   isSidebarCollapsed = false;

// // //   constructor(
// // //     private authService: AuthService,
// // //     private router: Router,
// // //     private http: HttpClient
// // //   ) {}

// // //   ngOnInit(): void {
// // //     this.authService.loggedIn$.subscribe((state) => {
// // //       this.isLoggedIn = state;
// // //       if (state) {
// // //         this.username = this.authService.getUsername() || 'User';
// // //         this.fetchSongs();
// // //       }
// // //     });
// // //   }

// // //   toggleSidebar(): void {
// // //     this.isSidebarCollapsed = !this.isSidebarCollapsed;
// // //   }

// // //   fetchSongs(): void {
// // //     this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
// // //       next: (data) => {
// // //         this.songs = data;
// // //       },
// // //       error: (err) => {
// // //         console.error('Error fetching songs:', err);
// // //       }
// // //     });
// // //   }

// // //   logout(): void {
// // //     this.authService.logout();
// // //     this.router.navigate(['/login']);
// // //   }

// // //   playSong(song: Song): void {
// // //     if (this.currentSong && this.currentSong._id === song._id) {
// // //       this.audio.pause();
// // //       this.currentSong = null;
// // //     } else {
// // //       this.audio.src = `http://localhost:3000/${song.url}`;
// // //       this.audio.play();
// // //       this.currentSong = song;
// // //     }
// // //   }
// // // }
// // import { Component, OnInit } from '@angular/core';
// // import { AuthService } from '../auth.services';
// // import { Router } from '@angular/router';
// // import { HttpClient } from '@angular/common/http';

// // export interface Song {
// //   _id: string;
// //   title: string;
// //   artist: string;
// //   genre: string;
// //   url: string;
// //   albumCover: string;
// // }

// // @Component({
// //   selector: 'app-home',
// //   templateUrl: './home.component.html',
// //   styleUrls: ['./home.component.css'],
// // })
// // export class HomeComponent implements OnInit {
// //   isLoggedIn = false;
// //   username = '';
// //   songs: Song[] = [];
// //   currentSong: Song | null = null;
// //   currentIndex: number = 0; // Add current index for songs
// //   audio = new Audio();
// //   isSidebarCollapsed = false;
// //   volume = 1; // Default volume is 100%

// //   constructor(
// //     private authService: AuthService,
// //     private router: Router,
// //     private http: HttpClient
// //   ) {}

// //   ngOnInit(): void {
// //     this.authService.loggedIn$.subscribe((state) => {
// //       this.isLoggedIn = state;
// //       if (state) {
// //         this.username = this.authService.getUsername() || 'User';
// //         this.fetchSongs();
// //       }
// //     });
// //   }

// //   toggleSidebar(): void {
// //     this.isSidebarCollapsed = !this.isSidebarCollapsed;
// //   }

// //   fetchSongs(): void {
// //     this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
// //       next: (data) => {
// //         this.songs = data;
// //       },
// //       error: (err) => {
// //         console.error('Error fetching songs:', err);
// //       }
// //     });
// //   }

// //   logout(): void {
// //     this.authService.logout();
// //     this.router.navigate(['/login']);
// //   }

// //   playSong(song: Song): void {
// //     if (this.currentSong && this.currentSong._id === song._id) {
// //       this.audio.pause();
// //       this.currentSong = null;
// //     } else {
// //       this.audio.src = `http://localhost:3000/${song.url}`;
// //       this.audio.play();
// //       this.currentSong = song;
// //     }
// //   }

// //   nextSong(): void {
// //     this.currentIndex = (this.currentIndex + 1) % this.songs.length; // Move to next song
// //     this.playSong(this.songs[this.currentIndex]);
// //   }

// //   previousSong(): void {
// //     this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length; // Move to previous song
// //     this.playSong(this.songs[this.currentIndex]);
// //   }

// //   setVolume(value: number): void {
// //     this.audio.volume = value; // Set volume
// //     this.volume = value;
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../auth.services';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// export interface Song {
//   _id: string;
//   title: string;
//   artist: string;
//   genre: string;
//   url: string;
//   albumCover: string;
// }

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent implements OnInit {
//   isLoggedIn = false;
//   username = '';
//   songs: Song[] = [];
//   currentSong: Song | null = null;
//   currentIndex: number = 0;
//   audio = new Audio();
//   isSidebarCollapsed = false;
//   volume = 1;
//   isSongPlaying = false;
//   seekPosition = 0;  // To track the seek position

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.authService.loggedIn$.subscribe((state) => {
//       this.isLoggedIn = state;
//       if (state) {
//         this.username = this.authService.getUsername() || 'User';
//         this.fetchSongs();
//       }
//     });

//     // Listen for the time update to set the seek bar position
//     this.audio.addEventListener('timeupdate', () => {
//       if (this.audio.duration) {
//         this.seekPosition = (this.audio.currentTime / this.audio.duration) * 100;
//       }
//     });
//   }

//   toggleSidebar(): void {
//     this.isSidebarCollapsed = !this.isSidebarCollapsed;
//   }

//   fetchSongs(): void {
//     this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
//       next: (data) => {
//         this.songs = data;
//       },
//       error: (err) => {
//         console.error('Error fetching songs:', err);
//       }
//     });
//   }

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }

//   playSong(song: Song): void {
//     if (this.currentSong && this.currentSong._id === song._id) {
//       if (this.isSongPlaying) {
//         this.audio.pause();
//         this.isSongPlaying = false;
//       } else {
//         this.audio.play();
//         this.isSongPlaying = true;
//       }
//     } else {
//       this.audio.src = `http://localhost:3000/${song.url}`;
//       this.audio.play();
//       this.currentSong = song;
//       this.isSongPlaying = true;
//     }
//   }

//   nextSong(): void {
//     this.currentIndex = (this.currentIndex + 1) % this.songs.length;
//     this.playSong(this.songs[this.currentIndex]);
//   }

//   previousSong(): void {
//     this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
//     this.playSong(this.songs[this.currentIndex]);
//   }

//   setVolume(value: number): void {
//     this.audio.volume = value;
//     this.volume = value;
//   }

//   setSeekPosition(event: any): void {
//     const newTime = (event.target.value / 100) * this.audio.duration;
//     this.audio.currentTime = newTime;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.services';
import { NavigationStart, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Song {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  url: string;
  albumCover: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  songs: Song[] = [];
  filteredSongs: Song[] = []; // To store filtered songs
  currentSong: Song | null = null;
  currentIndex: number = 0;
  audio = new Audio();
  isSidebarCollapsed = false;
  volume = 1;
  isSongPlaying = false;
  seekPosition = 0;  // To track the seek position
  searchQuery = '';  // To track search input

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
      this.fetchSongs();
      if (state) {
        this.username = this.authService.getUsername() || 'User';
        this.fetchSongs();
      }
    });

    // Listen for the time update to set the seek bar position
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration) {
        this.seekPosition = (this.audio.currentTime / this.audio.duration) * 100;
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.stopSong(); // Stop the song on route change
      }
    });
  }
  goToLogin(): void {
    this.router.navigate(['/login']); // Programmatically navigate to the login page
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  fetchSongs(): void {
    this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
      next: (data) => {
        this.songs = data;
        this.filteredSongs = data; // Initialize filtered songs with all songs
      },
      error: (err) => {
        console.error('Error fetching songs:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  playSong(song: Song): void {
    if (this.currentSong && this.currentSong._id === song._id) {
      if (this.isSongPlaying) {
        this.audio.pause();
        this.isSongPlaying = false;
      } else {
        this.audio.play();
        this.isSongPlaying = true;
      }
    } else {
      this.audio.src = `http://localhost:3000/${song.url}`;
      this.audio.play();
      this.currentSong = song;
      this.isSongPlaying = true;
    }
  }

  nextSong(): void {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length;
    this.playSong(this.songs[this.currentIndex]);
  }

  previousSong(): void {
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
    this.playSong(this.songs[this.currentIndex]);
  }

  setVolume(value: number): void {
    this.audio.volume = value;
    this.volume = value;
  }

  setSeekPosition(event: any): void {
    const newTime = (event.target.value / 100) * this.audio.duration;
    this.audio.currentTime = newTime;
  }

  searchSongs(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredSongs = this.songs; // Show all songs if search is empty
    } else {
      this.filteredSongs = this.songs.filter(song =>
        song.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
  stopSong(): void {
    if (this.isSongPlaying) {
      this.audio.pause();
      this.isSongPlaying = false;
      this.seekPosition = 0; // Reset the seek position
    }
  }
  
}
