import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth.services';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Define the Song interface
export interface Song {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  url: string;
  albumCover?: string; // Make albumCover optional to prevent undefined errors
}

export interface Playlist {
  _id: string;
  name: string;
  songs: Song[];
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
  filteredSongs: Song[] = [];
  currentSong: Song | null = null;
  currentIndex: number = 0;
  audio = new Audio();
  isSidebarCollapsed = false;
  volume = 1;
  isSongPlaying = false;
  showUploadSongModal = false;
  seekPosition = 0;
  searchQuery = '';
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  showSongModal = false;
  songSearchQuery = '';
  selectedSongs: Set<string> = new Set(); 
  newSong = { title: '', artist: '', songFile: null as File | null, albumCoverFile: null as File | null }; // Store file and details

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
      this.fetchSongs();
      if (state) {
        this.username = this.authService.getUsername() || 'User';
        this.fetchPlaylists();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration) {
        this.seekPosition = (this.audio.currentTime / this.audio.duration) * 100;
      }
    });
  }

  fetchSongs(): void {
    this.http.get<Song[]>('http://localhost:3000/songs').subscribe({
      next: (data) => {
        this.songs = data.filter(song => song); // Filter out any null values
        this.filteredSongs = [...this.songs]; // Ensure filteredSongs is updated
      },
      error: (err) => console.error('Error fetching songs:', err),
    });
  }

  fetchPlaylists(): void {
    this.http.get<Playlist[]>('http://localhost:3000/playlists').subscribe({
      next: (data) => {
        this.playlists = data;
      },
      error: (err) => console.error('Error fetching playlists:', err),
    });
  }
  // openUploadSongModal(): void {
  //   this.showUploadSongModal = true;
  // }

  // // Close the upload song modal
  // closeUploadSongModal(): void {
  //   this.showUploadSongModal = false;
  //   this.newSong = { title: '', artist: '', file: null }; // Reset the form fields
  // }
  //   // Handle the file selection
  //   onFileChange(event: any): void {
  //     const file = event.target.files[0];
  //     if (file) {
  //       this.newSong.file = file; // Store the file object
  //     }
  //   }
  
  //   // Handle the upload song
  //   uploadSong(): void {
  //     if (!this.newSong.file || !this.newSong.title || !this.newSong.artist) {
  //       alert('Please fill all fields');
  //       return;
  //     }
  
  //     const formData = new FormData();
  //     formData.append('file', this.newSong.file); // Append file
  //     formData.append('title', this.newSong.title);
  //     formData.append('artist', this.newSong.artist);
  
  //     this.http.post('http://localhost:3000/upload-song', formData).subscribe({
  //       next: (response) => {
  //         console.log('Song uploaded successfully:', response);
  //         this.closeUploadSongModal(); // Close the modal after uploading
  //         this.fetchSongs(); // Refresh the song list
  //       },
  //       error: (err) => {
  //         console.error('Error uploading song:', err);
  //         alert('Failed to upload song. Please try again.');
  //       },
  //     });
  //   }
  openUploadSongModal(): void {
    this.showUploadSongModal = true;
  }

  // Close the upload song modal
  closeUploadSongModal(): void {
    this.showUploadSongModal = false;
    this.newSong = { title: '', artist: '', songFile: null, albumCoverFile: null }; // Reset the form fields
  }

  // Handle the file input changes
  onFileChange(event: any, fileType: 'song' | 'albumCover'): void {
    const file = event.target.files[0];
    if (file) {
      if (fileType === 'song') {
        this.newSong.songFile = file;
      } else if (fileType === 'albumCover') {
        this.newSong.albumCoverFile = file;
      }
    }
  }

  // Handle the upload song
  uploadSong(): void {
    if (!this.newSong.songFile || !this.newSong.title || !this.newSong.artist) {
      alert('Please fill all fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.newSong.songFile); // Song file
    // Only append album cover if it's not null
    if (this.newSong.albumCoverFile) {
      formData.append('albumCover', this.newSong.albumCoverFile); // Album cover file
    }
    formData.append('title', this.newSong.title);
    formData.append('artist', this.newSong.artist);
  
    this.http.post('http://localhost:3000/upload-song', formData).subscribe({
      next: (response) => {
        console.log('Song uploaded successfully:', response);
        this.closeUploadSongModal(); // Close the modal after uploading
        this.fetchSongs(); // Refresh the song list
      },
      error: (err) => {
        console.error('Error uploading song:', err);
        alert('Failed to upload song. Please try again.');
      },
    });
  }
  


  selectPlaylist(playlist: Playlist): void {
    this.selectedPlaylist = playlist;
    this.filteredSongs = [...playlist.songs]; // Update UI instantly
  }

  showAddSongModal(): void {
   
    if (!this.selectedPlaylist) {
      alert('Please select a playlist first.');
      return;
    }

    // Filter out songs already in the playlist
    this.filteredSongs = this.songs.filter(
      song => !this.selectedPlaylist!.songs.some(playlistSong => playlistSong._id === song._id)
    );

    console.log('Filtered Songs:', this.filteredSongs); // Debugging

    this.selectedSongs.clear();
    this.cdr.detectChanges(); // Ensure UI updates

    setTimeout(() => {
      this.showSongModal = true;
    }, 0);
  }

  closeSongModal(): void {
    this.showSongModal = false;
    this.selectedSongs.clear();
  }

  toggleSongSelection(song: Song): void {
    if (this.selectedSongs.has(song._id)) {
      this.selectedSongs.delete(song._id);
    } else {
      this.selectedSongs.add(song._id);
    }
  }

 
  
    filterSongs(): void {
    this.filteredSongs = this.songs.filter((song) =>
      song.title.toLowerCase().includes(this.songSearchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(this.songSearchQuery.toLowerCase())
    );
  }
  goToLogin(): void {
    this.router.navigate(['/login']); // Programmatically navigate to the login page
  }
  goTohome(): void {
    window.location.reload() // Programmatically navigate to the login page
  }

  // }
  confirmAddSongs(): void {
    if (!this.selectedPlaylist || this.selectedSongs.size === 0) {
      alert('No songs selected.');
      return;
    }
  
    console.log('Song IDs to add:', this.selectedSongs); // Debugging output
  
    this.selectedSongs.forEach(songId => {
      const song = this.songs.find(s => s._id === songId); // Ensure the song exists
      if (song) {
        this.addSongToPlaylist(song); // Call addSongToPlaylist with each song
      } else {
        console.error('Song not found in local list:', songId);
      }
    });
  
    this.closeSongModal();
  }
  

  addSongToPlaylist(song: Song): void {
    if (!this.selectedPlaylist || !this.selectedPlaylist._id) {
      console.error("No playlist selected.");
      return;
    }
  
    console.log(`Adding song: ${song._id} to playlist: ${this.selectedPlaylist._id}`); // Debugging output
  
    this.http
      .post<Playlist>(`http://localhost:3000/playlists/${this.selectedPlaylist._id}/songs`, { songId: song._id })
      .subscribe({
        next: (updatedPlaylist) => {
          if (this.selectedPlaylist && this.selectedPlaylist._id === updatedPlaylist._id) {
            this.selectedPlaylist.songs = [...updatedPlaylist.songs];
          }
          this.showSongModal = false;
        },
        error: (err) => console.error('Error adding song:', err),
      });
      window.location.reload();
  }
  

  
  removeSongFromPlaylist(songId: string): void {
    
    if (!this.selectedPlaylist || !this.selectedPlaylist._id) {
      console.error("No playlist selected.");
      return;
    }
  
    this.http.delete<{ success: boolean; updatedPlaylist: Playlist }>(
      `http://localhost:3000/playlists/${this.selectedPlaylist._id}/songs/${songId}`
    ).subscribe({
      next: (response) => {
        if (response.success) {
          // Remove song from UI immediately without refreshing
          this.selectedPlaylist!.songs = response.updatedPlaylist.songs;
          this.filteredSongs = [...response.updatedPlaylist.songs];
  
          console.log('Song removed successfully:', songId);
        } else {
          console.error('Failed to remove song from database');
        }
      },
      error: (err) => {
        console.error('Error removing song:', err);
        alert('Failed to remove song. Please try again.');
      },
    });
    window.location.reload();
  }
  removePlaylist(playlistId: string): void {
    console.log(playlistId);
    if (!confirm('Are you sure you want to delete this playlist?')) return;
  
    this.http.delete<{ success: boolean }>(`http://localhost:3000/playlists/${playlistId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Remove the deleted playlist from the UI
            this.playlists = this.playlists.filter(p => p._id !== playlistId);
            this.selectedPlaylist = null; // Reset selected playlist
            this.filteredSongs = [...this.songs]; // Reset song list
  
            console.log('Playlist removed successfully:', playlistId);
          } else {
            console.error('Failed to remove playlist');
          }
        },
        error: (err) => {
          console.error('Error removing playlist:', err);
          alert('Failed to remove playlist. Please try again.');
        },
      });
  }
  
 
  

  playSong(song: Song): void {
    if (!song || !song.url) return; // Ensure valid song object
    if (this.currentSong && this.currentSong._id === song._id) {
      this.isSongPlaying ? this.audio.pause() : this.audio.play();
      this.isSongPlaying = !this.isSongPlaying;
    } else {
      this.audio.src = `http://localhost:3000/${song.url}`;
      this.audio.play();
      this.currentSong = song;
      this.isSongPlaying = true;
      this.currentIndex = this.songs.findIndex(s => s._id === song._id);
    }
  }
  // playSong(song: Song): void {
  //   if (!song || !song.url) return; // Ensure valid song object
  //   const audioUrl = `http://localhost:3000${song.url}`; // Prefix the URL with the base URL
  
  //   if (this.currentSong && this.currentSong._id === song._id) {
  //     this.isSongPlaying ? this.audio.pause() : this.audio.play();
  //     this.isSongPlaying = !this.isSongPlaying;
  //   } else {
  //     this.audio.src = audioUrl; // Set the source to the correct URL
  //     this.audio.play();
  //     this.currentSong = song;
  //     this.isSongPlaying = true;
  //     this.currentIndex = this.songs.findIndex(s => s._id === song._id);
  //   }
  // }
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // nextSong(): void {
  //   this.currentIndex = (this.currentIndex + 1) % this.songs.length;
  //   this.playSong(this.songs[this.currentIndex]);
  // }

  // previousSong(): void {
  //   this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
  //   this.playSong(this.songs[this.currentIndex]);
  // }
  nextSong(): void {
    const songList = this.selectedPlaylist ? this.selectedPlaylist.songs : this.songs;
    
    if (!songList.length) return; // No songs to play
    
    const currentIndex = songList.findIndex(song => song._id === this.currentSong?._id);
  
    if (currentIndex !== -1 && currentIndex < songList.length - 1) {
      this.playSong(songList[currentIndex + 1]);
    }
  }
  
  previousSong(): void {
    const songList = this.selectedPlaylist ? this.selectedPlaylist.songs : this.songs;
    
    if (!songList.length) return; // No songs to play
    
    const currentIndex = songList.findIndex(song => song._id === this.currentSong?._id);
  
    if (currentIndex > 0) {
      this.playSong(songList[currentIndex - 1]);
    }
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
      this.filteredSongs = [...this.songs]; // Ensure UI updates
    } else {
      this.filteredSongs = this.songs.filter(song =>
        song.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  createPlaylist(): void {
    const playlistName = prompt('Enter playlist name:');
    if (!playlistName) return;

    this.http.post<Playlist>('http://localhost:3000/playlists', { name: playlistName }).subscribe({
      next: (newPlaylist) => {
        this.playlists.push(newPlaylist);
      },
      error: (err) => console.error('Error creating playlist:', err),
    });
  }
}

