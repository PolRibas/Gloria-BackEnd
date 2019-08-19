'use strict';

const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Club = require('../models/Club');
const Team = require('../models/Team');
const Event = require('../models/Event');

const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin,
    validationSignup
  } = require('../helpers/middlewares');

router.post('/createClub', async (req, res, next) => {
      try {
            const name = req.body.name;
            const administrators = []
            req.body.admins.forEach((user) =>{
                if(user._id !== null){administrators.push(user._id)}
            })
            const city = req.body.city;
            const sport = req.body.sport;
            const newClub = await Club.create({ name, administrators, city, sport});
          return res.status(200).json(newClub);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/admin/:id', async (req,res,next) => {
    try{
        const id = req.params.id
        const allClubs = await Club.find().populate({
            path: 'teams',
            populate:{
                path: 'treiners'
            },
            populate:{
                path: 'players'
            },
        })
        let myClub = {club: 'noclub'};

        allClubs.forEach((club) => {
            club.administrators.forEach((admin) => {
           
                if(admin !== null){
                if(admin.equals(id)){
             
                    myClub = club
                }}
            })
        })
        return res.status(200).json(myClub);
    }catch (err){
        next(err)
    }
  })

  router.get('/myteam/:id', async (req,res,next) => {
    try{
        const id = req.params.id
        const allClubs = await Club.find().populate({
            path: 'teams',
            populate:{
                path: 'treiners'
            },
            populate:{
                path: 'players'
            }
            })
        let myteam = '' 
        allClubs.forEach(club => {
            club.teams.forEach(team => {
                if(team._id.equals(id)){
                    myteam = team
                }
            })
        })

        return res.status(200).json(myteam);
    }catch (err){
        next(err)
    }

  })


  router.put('/createTeam', async (req,res,next) => {
    try{
        const {treiners, name, clubId} = req.body

        const _id = clubId
        
        const newOne = await Team.create({treiners, name});
        await Club.findByIdAndUpdate(_id, {$push: {teams: newOne._id}}, {new: true})
        const newTeam = await Club.findById(_id).populate({
            path: 'teams',
            populate:{
                path: 'treiners'
            }})

        return res.status(200).json(newTeam);
    }catch (err){
        next(err)
    }
  })

  router.put('/addPlayerToTeam', async (req,res,next) => {
    try{
        const {idTeam, idPlayer} = req.body
 
        const _id = idTeam._id
        const newTeam = await Team.findByIdAndUpdate(_id, {$push: {players: idPlayer._id}}, {new:true})
        return res.status(200).json(newTeam);
    }catch (err){
        next(err)
    }
  })

  router.get('/iAmInAClubInterfice/:id', async (req,res,next) => {
    try{
        const id = req.params.id
        const allClubs = await Club.find().populate({
            path: 'teams',
            populate:{
                path: 'treiners'
            },
            populate:{
                path: 'players'
            },
        })
        let myClub = {myClub: 'No club'};
        allClubs.forEach((club) => {
        if(club.players){
            club.players.forEach((player) => {
               
                    if(player !== null){
                    if(player.equals(id)){
                        
                        myClub = club
                    }}
        })}
        if(club.treiners){
        club.treiners.forEach((coach) => {
   
                if(coach !== null){
                if(coach.equals(id)){
                    
                    myClub = club
                }}
        })}
        club.administrators.forEach((admin) => {
 
                if(admin !== null){
                if(admin.equals(id)){
                    
                    myClub = club
                }}
            })
        })

        return res.status(200).json(myClub);
    }catch (err){
        next(err)
    }
  })

  router.put('/createEvent', async (req, res, next) =>  {
    try{
        const {teamId, type, date} = req.body;
        const newEvent = await Event.create({team: teamId, type, date, done: false})
        await Team.findByIdAndUpdate({_id: teamId}, {$push: {events: newEvent._id}})
        return res.status(200).json(newEvent);
    }catch (err){
        next(err)
    }
  })

  router.get('/loadEvents', async (req, res, next) =>  {
    try{
        const id = req.session.currentUser._id
        const allTeams = await Team.find().populate("events");
        const teamEvents = allTeams.filter(team=> team.players.includes(id) || team.treiners.includes(id) && team);
       return res.status(200).json(teamEvents)
    }
    catch (err){
        next(err)
    }
  })

//   router.get('/loadEvents', async (req, res, next) =>  {
//     try{
//         const id = req.session.currentUser._id
//         const myEvents = [];
//         const allTeams = await Team.find();
        
//         let getEvents = eventArray => { eventArray.map(async (eventId) => {
//                 let event = await Event.findById(eventId)
//                  myEvents.push(event);
//                 console.log("HERE",myEvents)
               
//             })}

//             const teamPromises = await allTeams.filter((async (team) => {
//                 return team.players.includes(id) || team.treiners.includes(id) && Promise.all([getEvents(team.events)])
//                     .then(data => data)}))
                    
//                     Promise.all(teamPromises)
//                         .then(data => {
//                             console.log(data)
//                             console.log("MyEvents", myEvents);
                            
//                         })
//                         .catch(error =>console.log(error))
//     }

        
       
//     //    return res.status(200).json(myEvents)
//     catch (err){
//         next(err)
//     }
//   })


  
  module.exports = router;






        // await allTeams.forEach(async (team) => {
            //     await team.players.forEach( async (player) => {
            //         if(player.equals(id)){
            //             team.events.forEach( async (event) => {
            //                 const OneEvent = await Event.findById(event);
            //                 myEvents.push(OneEvent)
            //             }) 
            //         }
            //     })
            //     if(!player){
            //     await team.treiners.forEach( async (treiner) => {
            //         if(treiner.equals(id)){
            //             team.events.forEach( async (event) => {
            //                 const OneEvent = await Event.findById(event);
            //                 myEvents.push(OneEvent)
            //                 console.log(myEvents)
            //             }) 
            //         }
            //     })}
            //     player = false;
            // })