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
  constructor(private http: HttpClient){

  }
  calculateBearingAngle(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      // Get device orientation data
      setInterval(()=>{window.addEventListener('deviceorientation', (event) => {
        console.log(event);
         this.heading = event.alpha; // Device heading in degrees (0 to 360)

        // this.heading = 45;
        // Calculate bearing angle
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
        // let address="Chennai";
        // let url="https://api.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(address)+".json?access_token=pk.eyJ1IjoiY2hhcmNoaXR2MDUiLCJhIjoiY2p5d29ocmRlMHppNDNjcnIwZ3I2YzBibCJ9.8yxqlYvIibh6_iBQCKuAKQ&limit=1";
        // this.getLatandLang(url);

        // Target location (replace with your desired location)
        const targetLat = 13.08;
        const targetLng = 80.27;

        // Calculate latitudinal and longitudinal difference
        const latDiff = targetLat - this.currentLat;
        const lngDiff = targetLng - this.currentLng;

        // Calculate bearing angle using trigonometry
        const bearing = (Math.atan2(lngDiff, latDiff) * 180) / Math.PI;

        const distance = 2186000; // Distance in meters (10 km)

    const newCoords = computeDestinationPoint(
      { latitude: this.currentLat, longitude: this.currentLng },
      distance,
      bearing
    );

        console.log("Device Heading:", this.heading);
        console.log("Bearing Angle:", bearing);

    const newLat = newCoords.latitude;
    const newLng = newCoords.longitude;

    console.log("Current Location:", this.currentLat, this.currentLng);
    console.log("New Location 10 km away:", newLat, newLng);


        // Now you can use the bearing angle as needed
      });},1000)

    });

  }

  getLatandLang(url: any){
    this.http.get(url).subscribe((response)=>{
      console.log(response);
    })
  }
}
