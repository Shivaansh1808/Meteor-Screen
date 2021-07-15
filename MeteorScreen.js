import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, Image, Platform, ImageBackground, StatusBar } from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      meteors: {}
    }
  }

  getmeteors = ()=>{
    axios.get('https://api.nasa.gov/neo/rest/v1/feed?api_key=A1WmArSzawkbv48w8FYTdStErUzy9qumycPROeOk')
    .then(response=>{
      this.setState({meteors: response.data.near_earth_objects})
    })
    .catch(error=>{
      alert(error.message)
    })
  }

  componentDidMount(){
    this.getmeteors()
  }

  keyExtractor = (item,index)=>index.toString()

  renderItem = ({item})=>{
    var meteor = item
    let bg_img,speed,size
    if(meteor.threat_score<=30){
      bg_img = require("../assets/meteor_bg1.png")
      speed = require("../assets/meteor_speed3.gif")
      size = 100
    }else if(meteor.threat_score<=75){
      bg_img = require("../assets/meteor_bg2.png")
      speed = require("../assets/meteor_speed2.gif")
      size = 150
    }else {
        bg_img = require("../assets/meteor_bg3.png")
        speed = require("../assets/meteor_speed1.gif")
        size = 200
    }
    return(
      <View>
        <ImageBackground style = {styles.bgImage} source = {bg_img}>
            <View style = {styles.gifContainer}>
              <Image style = {{width: size,height: size, alignSelf: 'center'}} source = {speed}/>
              <View>

                <Text style = {styles.cardTitle}>
                  {item.name}
                </Text>
                <Text style = {styles.cardText}>
                  Closest to Earth-{item.close_approach_data[0].close_approach_date_full}
                </Text>

                <Text style = {styles.cardText}>
                  MiniMum diameter(km) - {item.estimated_diameter.kilometers.estimated_diameter_min}                  
                </Text>
              
                <Text style = {styles.cardText}>
                Maximum diameter(km) - {item.estimated_diameter.kilometers.estimated_diameter_max}  
                </Text>

                <Text style = {styles.cardText}>
                Velocity(km/h) - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}
                </Text>

                <Text style = {styles.cardText}>
                Missing Earth by (km) - {item.close_approach_data[0].miss_distance.kilometers}
                </Text>

              </View>
            </View>
        </ImageBackground>
      </View>
    )
  }

render(){
  if(Object.keys(this.state.meteors).length === 0){
  return(
  <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Loading...</Text>
  </View>
  )}else{

    var meteor_arr = Object.keys(this.state.meteors).map(meteor_date=>{
      return this.state.meteors[meteor_date]
    })

    var meteors = [].concat.apply([],meteor_arr)

    meteors.forEach(function(element) {
let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min+element.estimated_diameter.kilometers.estimated_diameter_max)/2

       let threatScore = (diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000

       element.threat_score = threatScore
       
    });

    meteors.sort(function(a,b){
      return(b.threat_score-a.threat_score)
    })
    meteors = meteors.slice(0,5)
    return(
      <View style = {styles.container}>
        <SafeAreaView style = {styles.androidSafeArea}>
          <FlatList
            keyExtractor = {this.keyExtractor}
            data = {meteors}
            renderItem = {this.renderItem}
            horizontal = {true}
          />
        </SafeAreaView>
      </View>
    )
  }
  }
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
    },
    androidSafeArea: {
      marginTop: Platform.OS === "android"?StatusBar.currentHeight:0,
    },
    bgImage: {
      flex: 1,
      resizeMode: 'cover'
  },
  titleBar: {
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 40,
    color: 'white'
  },
  listContainer: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  cardText: {
    color: 'white'
  },
  gifContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  meteorDataContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  meteorContainer: {
    flex: 0.8,
  }
})