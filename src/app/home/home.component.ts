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
  // file: string;
  file: string | { type: 'Buffer'; data: number[] };
  albumCover: string; // Make albumCover optional to prevent undefined errors
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
  isLoggedIn:boolean=false;
  isLoading: boolean = false; 
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
  // newSong = { title: '', artist: '', songFile: null as File | null, albumCoverFile: null as File | null }; // Store file and details
  newSong = { title: '', artist: '', songFile: null as File | null, albumCoverFile: null as File | null };
  uri12 = 'http://localhost:3000';

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
        this.username = this.authService.getUsername() || 'User , please logout and re-login';
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
  localStorage.setItem("isLoading","true")
  this.isLoading = true; // Show loading spinner while fetching songs
  console.log(this.isLoading);
  this.http.get<Song[]>(`${this.uri12}/songs`).subscribe({
    next: (data) => {
      console.log("Fetched songs:", data); // Debugging output
      this.songs = data.map(song => ({
        _id: song._id,
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        file: song.file,
        albumCover: song.albumCover ? `${this.uri12}/album-cover/${song._id}` : 'assets/default-cover.jpg' // ✅ Set correct image URL
      }));
      this.filteredSongs = [...this.songs];
      this.isLoading = false; // Hide loading spinner after fetching songs
      localStorage.setItem("isLoading","false")
    },
    error: (err) => console.error('Error fetching songs:', err),
  });
  this.isLoading=false;
}

isLoading1(): any{

  return localStorage.getItem("isLoading")==='true';
}


  fetchPlaylists(): void {
    this.http.get<Playlist[]>(`${this.uri12}/playlists`).subscribe({
      next: (data) => {
        this.playlists = data;
      },
      error: (err) => console.error('Error fetching playlists:', err),
    });
  }

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

  uploadSong(): void {
    if (!this.newSong.songFile || !this.newSong.title || !this.newSong.artist) {
      alert('Please fill all fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.newSong.songFile); // Song file
    if (this.newSong.albumCoverFile) {
      formData.append('albumCover', this.newSong.albumCoverFile); // Album cover file
    }
    formData.append('title', this.newSong.title);
    formData.append('artist', this.newSong.artist);
  
    this.http.post(`${this.uri12}/upload-song`, formData).subscribe({
      next: (response) => {
        console.log('Song uploaded successfully:', response);
        this.closeUploadSongModal();  // Close the modal after uploading
        this.fetchSongs();  // Refresh the song list
      },
      error: (err) => {
        console.error('Error uploading song:', err);
        alert('Failed to upload song. Please try again.');
      },
    });
  }
  
  
  selectPlaylist(playlist: Playlist): void {
    this.selectedPlaylist = {
      ...playlist,
      songs: playlist.songs.map(song => ({
        ...song,
        albumCover: song.albumCover ? `${this.uri12}/album-cover/${song._id}` : 'assets/default-cover.jpg'
      }))
    };
    this.filteredSongs = [...this.selectedPlaylist.songs]; // Ensure UI updates
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
  gotologout(): void {
    localStorage.setItem("isLoggedIn",'false');
    this.router.navigate(['/logout']); // Programmatically navigate to the login page
  }
  goTohome(): void {
    window.location.reload() // Programmatically navigate to the login page
  }

 
  confirmAddSongs(): void {
    if (!this.selectedPlaylist || this.selectedSongs.size === 0) {
      alert('No songs selected.');
      return;
    }
  
    console.log('Adding Songs:', this.selectedSongs);
  
    this.selectedSongs.forEach(songId => {
      this.addSongToPlaylist(songId);
    });
  
    this.closeSongModal();
  }

  
  addSongToPlaylist(songId: string): void {
    if (!this.selectedPlaylist || !this.selectedPlaylist._id) {
      console.error("No playlist selected.");
      return;
    }
  
    console.log(`Adding Song: ${songId} to Playlist: ${this.selectedPlaylist._id}`);
  
    this.http.post<Playlist>(`${this.uri12}/playlists/${this.selectedPlaylist._id}/songs`, { songId })
      .subscribe({
        next: (updatedPlaylist) => {
          if (this.selectedPlaylist && this.selectedPlaylist._id === updatedPlaylist._id) {
            this.selectedPlaylist.songs = [...updatedPlaylist.songs];
          }
          console.log('Song Added Successfully:', songId);
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
     `${this.uri12}/playlists/${this.selectedPlaylist!._id}/songs/${songId}`
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
    if (!confirm('Are you sure you want to delete this playlist?')) return;
  
    console.log(`Deleting Playlist: ${playlistId}`);
  
    this.http.delete<{ success: boolean }>(`${this.uri12}/playlists/${playlistId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.playlists = this.playlists.filter(p => p._id !== playlistId);
            this.selectedPlaylist = null;
            this.filteredSongs = [...this.songs];
  
            console.log('Playlist Removed Successfully:', playlistId);
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
  if (!song || !song.file) {
    console.error('No song or file provided.');
    return;
  }

  if (this.currentSong && this.currentSong._id === song._id) {
    // Toggle play/pause if the same song is clicked
    if (this.isSongPlaying) {
      this.audio.pause();
      this.isSongPlaying = false;
    } else {
      this.audio.play();
      this.isSongPlaying = true;
    }
    return;
  }

  // If a different song is clicked, stop the current one
  this.audio.pause();
  this.audio.currentTime = 0; // Reset time for new song

  if (typeof song.file === 'string') {
    // Case 1: File is a URL/path
    this.audio.src = `${this.uri12}/songs/${song._id}`; // Ensure correct URL
  } else if (typeof song.file === 'object' && song.file.type === 'Buffer' && Array.isArray(song.file.data)) {
    // Case 2: File is stored as a buffer
    const byteArray = new Uint8Array(song.file.data);
    const blob = new Blob([byteArray.buffer], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);
    this.audio.src = audioUrl;
  } else {
    console.error('Invalid file format:', song.file);
    return;
  }

  this.audio.load();
  this.audio.play().then(() => {
    this.isSongPlaying = true;
    this.currentSong = song;
    this.currentIndex = this.songs.findIndex(s => s._id === song._id);
  }).catch(err => {
    console.error('Error playing song:', err);
  });
}

   
  
  logout(): void {
    localStorage.setItem('isLoggedIn1', "false"); 
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isloggedin1(): boolean{
    return this.username == "User , please logout and re-login";
  }
 
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
  
    this.http.post<Playlist>(`${this.uri12}/playlists`, { name: playlistName }).subscribe({
      next: (newPlaylist) => {
        this.playlists.push(newPlaylist);
        console.log('Playlist Created Successfully:', newPlaylist);
      },
      error: (err) => console.error('Error creating playlist:', err),
    });
  }
}

