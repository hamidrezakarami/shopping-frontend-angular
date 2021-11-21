export class Directions {
   
    origin: 'Chicago, IL';
    destination: 'Los Angeles, CA';
    waypoints: [
      {
        location: 'Joplin, MO',
        stopover: false
      },{
        location: 'Oklahoma City, OK',
        stopover: true
      }];
    provideRouteAlternatives: false;
    travelMode: 'DRIVING';
    drivingOptions: {
      //departureTime: new Date(now),
      trafficModel: 'pessimistic'
    }
}