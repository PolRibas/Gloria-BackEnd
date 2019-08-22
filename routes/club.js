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
        const {teamId, type, date, title, rival} = req.body;
        console.log(req.body)
        const newEvent = await Event.create({team: teamId, type, date, title, rival, done: false})
        console.log(newEvent)
        await Team.findByIdAndUpdate({_id: teamId}, {$push: {events: newEvent._id}}, {new: true})
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

  router.get('/getEvent/:id', async (req, res, next) =>  {
    try{
        const id = req.params.id
        console.log(id)
        const event = await Event.findById(id).populate('team')
       return res.status(200).json(event)
    } 
    catch (err){
        next(err)
    }
  })

  router.delete('/deleteEvent/:id', async (req, res, next) =>  {
    try{
        const id = req.params.id
        console.log(id)
        await Event.findByIdAndDelete(id)
       return res.status(200).json(id)
    } 
    catch (err){
        next(err)
    }
  })

  router.put('/updateEvent', async (req, res, next) =>  {
    try{
        const data = req.body
        const {physicalDrain, rivalGoals, myGoals, type, id, url} = data
        if(type === 'match'){
            await Event.findByIdAndUpdate(id, {physicalDrain, image: url, done: true, 
            $push: { 'personalData.data': [{name: 'myGoals', param: myGoals }, {name: 'rivalGoals', param: rivalGoals }]} },{new: true})
        }else{
            await Event.findByIdAndUpdate(id, {physicalDrain, image: url, done: true})
        }
        return res.status(200).json('All ok')
    } 
    catch (err){
        next(err)
    }
  })


//   updateEvent(data){
//     return this.clubService.put(`/club/updateEvent/`, data)
//   }



  
  module.exports = router;
