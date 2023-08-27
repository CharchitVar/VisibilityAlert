import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { computeDestinationPoint } from 'geolib';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'VisibilityAlertMechanism';
  currentLat: any;
  currentLng: any;
  heading: any;
  newCoords: any;
  visibility: number =0;
  areaName: string ='';
  distance: number =10;
  firstResponseCame: boolean = false;
  loading = false;
  isError = false;
  movingDirection: string ='';
  constructor(private http: HttpClient){
  }
  intervalListener: any;
  errorMessage: string ='';
  calculateStart(){

      this.loading = true;
      this.intervalListener = setInterval(() => {
       if(this.distance == 0){
         this.distance = 10;
       }
       this.calculateVisibilty();
       this.firstResponseCame = true;
       this.loading = false;
     }, 5000); // 1 minute in milliseconds
    
   
  }
  onDistanceChange(ev: any){
    this.firstResponseCame = false;
    this.loading = true;
    this.calculateStart();
  }
  calculateVisibilty(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const orientationHandler = (event: any) => {
        console.log(event);
        this.heading = event.alpha; // Device heading in degrees (0 to 360)
        this.movingDirection = this.getDirectionFromAlpha(this.heading);

        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;

        const distance = Number(this.distance) * 1000;

        const newCoords = computeDestinationPoint(
          { latitude: this.currentLat, longitude: this.currentLng },
          distance,
          this.heading
        );
        this.newCoords = newCoords;
        this.getVisibility(this.newCoords);

        window.removeEventListener('deviceorientation', orientationHandler);
      };

      window.addEventListener('deviceorientation', orientationHandler);
      this.firstResponseCame = true;
      this.isError = false;
    },(error: GeolocationPositionError)=>{
      if(error){
        this.firstResponseCame = false;
        this.isError = true;
        this.errorMessage = 'Error in Getting your Location. Please check the location access of your Browser ';
      }
    
    });
  }

  getDirectionFromAlpha(alpha: number): string {
    if (alpha >= 0 && alpha < 45) {
      return 'North';
    } else if (alpha >= 45 && alpha < 135) {
      return 'East';
    } else if (alpha >= 135 && alpha < 225) {
      return 'South';
    } else if (alpha >= 225 && alpha < 315) {
      return 'West';
    } else {
      return 'North';
    }
  }

  getVisibility(newCoords: any){
    
   const url ='https://api.openweathermap.org/data/2.5/weather?lat='+newCoords.latitude+'&lon='+newCoords.longitude+'&appid=78c692fdd6147f943a2ca9277a3249bf';
    this.http.get(url).subscribe((response: any)=>{
      console.log(response);
      this.firstResponseCame = true;
      this.visibility = response.visibility/1000;
      this.areaName = response.name;
      window.removeEventListener('deviceorientation',()=>{

      });
    })
  }
  clickHomePage(){
    this.firstResponseCame = false;
    this.distance =10;
    window.clearInterval(this.intervalListener);
  }
}



