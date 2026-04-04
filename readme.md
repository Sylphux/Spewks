# Spewks
![stack](https://img.shields.io/badge/Stack-HTML/CSS/JS-yellow) 
![licence](https://img.shields.io/badge/License-GPL_3.0-black?logo=github) 

```
|  __                   ____   | 
|____                ______    |
|  _____              ___      |
|      _________               |
|    ________\___/_            |
| ___________ U_u              |
|____            -             |
|                              |
|               ______         |
|                  _______     |
|               ______________ |
|       /   ______________     |
|       _______________        |
|LV 3+  ________            __ |
```
**Spewks is a tamagochi inspired ASCII game in JS.
Observe your little Spewk wander around and grow.**

## What makes this special

Your Spewk has emotions and can be very talkative / active. Depending on his natural temperament, and how you treat it, it will behave differently. **Every Spewk in unique**, that's what makes this game special. (Communication is under development). I work on this game for code training purposes, but also because I love tamagochi like games!

## How does it work

### Stack

This is made purely in JS, HTML and CSS, without any external library being used. It can be ran locally and everything happends on the client side.

### Graphics

Multiple layers are rendered into the render zone at a rate of 16 frames per second.
The layers are combined and rendered at every frame by an async function running in loops.

The ascii animations are made with https://ascii-motion.app/ and the project files are saved in Assets/ascii_motions. I will try to code a python script that converts the rendered json files into simple arrays that we can instantly paste in ascii_graphics.js to work faster on graphics.

I'm currently experimenting with graphics, so a lot of them may change quite radically while the project advances.

Adding graphics and animations is probably the easiest way to contribute when being a non-coder. So feel free to try and send pull requests with new graphics elements !

### Game saving

Your progress is saved into Local Storage every x seconds, so your can find your spewk again when you come back to the site.

### Other mechanic aspects

There are a lot of things happening at the same time. Feel free to look at the code.

## How to play 

You can either play locally by downloading the files or going directly to https://sylphux.github.io/Spewks/

You can either watch passively your Spewk evolve, or talk to it and make it evolve as it eats.

### Leveling

As your Spewk finds food, it will gain XP and Levels. At every level, you unlock the opportunity to add a character to your Spewk, making it unique.

### Chatting and commands

This is not available still, but most of the interactions with your spewk will occur from a terminal like chat panel. You will be able to either discuss with or to interact with your Spewk. (Under development ATM)

### What is the goal of the game 

The only goal is to watch your little Spewk live and develop !

## What will be coming soon

### Features

I have a lot of ideas to implement in Spewks. Here are some that will be soon be included :
- Talk with your spewk
- Spewk has emotions
- Change default site theme with a command
- This is already a lot!

### Coming fixes

- Some known bugs after upgrades will be fixed

## Disclaimers

At the moment, Spewks is still very unstable. You may lose your progress during playtime or when major updates occur.

### Technical disclaimer

This games runs entierly locally with pure JS/HTML/CSS.
Obviously, it's entirely hackable if you want to mess with it.