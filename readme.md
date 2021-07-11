# Matchmaking Bot
# Development documentation

## TODO (this documentation):
1. start moving everything after introduction to wiki pages
2. document entity relations: leagues know of their matches, participants, and roles. matches also know of their participants (in app, not in storage).
3. figure out a nice way to do the math notation in the wiki pages
4. stop using todo lists and use github's built in kanban board
   
## TODO (Application):
1. start adding docstrings to methods so we can eventually use jsdoc to generate the technical specifications
2. decide on a testing framework to use
3. Bot permissions. Only listen to privileged roles. 
4. !**kick** league member (set inactive)
5. !**ban** league member (prevent discord user id from entering league)
6. Set role min-max. can be one command. see **match_params** table in schema sketch
7. !**help** to list bot commands
8. !**matchmake**. set teams for the league's next event. will populate **matched player** table
   1. will show teams on matchmake by default
9. !**show-teams** show team allocations from !matchmake
10. Allow event announcements to listen for reactions once the bot has restarted
    1.  "Listening for reactions on old messages" discord.js guide
11. Make bot DM registered members before event start



### Table of contents
  - [Introduction](#introduction)
  - [Overview](#overview)
    - [Match organization](#match-organization)
    - [Matchmaking - Role distribution](#matchmaking---role-distribution)
    - [Matchmaking - Player rating](#matchmaking---player-rating)
  - [Functional Requirements](#functional-requirements)
    - [Admin Commands](#admin-commands-dont-type-the-brackets)
    - [Participant Actions](#participant-actions)
  - [Technical Specifications](#technical-specifications)



## Introduction
- This is a bot application for Discord intended to help organize 15v15 matches.  
- All actions interfacing with this bot will be avaiable in the form of Discord reactions for participants and text channel commands for administrators. 

## Overview 
### Match organization
1. match **organizers** will be able to create an **match** at a given date and time
2. For a given server, there will be a set of pre defined **roles**
3. **Participants** can **RSVP** to an match by reacting to one of the match **announcement messages**
4. Each match will have two announcement messages. Role reactions to the first designate a participant's **primary** roles to the match; role reactions to the second message specify **secondary** roles. 
5. Participants can specify willingness to **sub** by adding the sub reaction. 
### Matchmaking - Role distribution
6. This application will attempt to distribute participants into **teams** of 15 given minimum, optimal, and max parameters for role populations.
7. Primary role signups are given greater **priority** than secondary role signups. Participants are permitted to have all primary, all secondy, or a mix of both signups.
8. Subs are given the lowest priority unless a role has yet to reach its minimum number of participants or another role has exceeded its maximum. 
### Matchmaking - Player rating
9. We will attempt to use hidden Elo ratings to distribute players and generate fair matches.
    - Elo starts with a value of 1000. $K$ begins at $100$ and decreases at a rate of $20log(10n)$ where $n$ is the number of matches played by that participant
    - Let $R_A$ be a participant's elo and $R_B$ be the mean elo of an opposing team.
    - Expectation $A$ beats $B$: $E_A$ = 1/(1+10<sup>(R<sub>B</sub>-R<sub>A</sub>)/400</sup>)
    - Result $S_A$ = 1 if A wins, 0 if B wins
    - $R'_A = R_A + K(S_A - E_A)$
  
10. Participants will be assigned teams based on rating first, then role adjustments will be made.
    - We use the [Karmarkar–Karp algorithm](https://en.wikipedia.org/wiki/Largest_differencing_method) to create workable partitioning approximations 
    - Sort participant Elo ratings in decreasing order. 
    - Given $k$ teams, allocate the greatest $k$ ratings to each subset such that the total difference between subsets is minimized until no participants remain
    - Adjust team membership to fit role parameters under the same constraint

## Functional Requirements
### Commands
1. `!event-create yyyy-mm-dd HH:mm TZ` 
   - admin only
   - Creates an **event** at the given date and time for the given timezone.
   - TZ options: NA = Eastern Time, EU = Central European Time 
   - Posts an **event announcement message** in the **event channel** 
2. `event-channel <channel-name>`
   - admin only
   - Designates the channel where event announcements will be posted.
3. `add-role <role-name>`
   - admin only
   - Adds a participant role for matches
   - Uses an emoji already present on the server with the given name
4. `activate-role / deactivate-role <role-name>`
   - admin only
   - Sets given role to active or inactive, respectively
5. `roles-min-max <role-name min max>`
   - admin only
   - Set the min and max role population parameter
6. `list-rated-players`
   - Displays a list of all players signed up for the league
7. `enter-league`
   - Create a rated player record if there is none. Give league member role. active to true
8. `leave-league`
   - Set rated player active false. remove discord role
9.  `member-role <role name>`
    - admin only
    - Designates a role in the guild as the league member role
10. `matchmake`
    - admin only
    - Consider the next upcoming event on the server
    - Count participants among league members who've role-reacted to the event
    - use matchmaking algorithm to create matched player records
    - display teams
11. `help`
    - display a list of commands and their descriptions


## Technical Specifications
### Schema sketch: 
https://docs.google.com/spreadsheets/d/1ZfkumlYtyvH29dL8cPyJHThUyCiRZYh9lvjmKGelFQ4/edit?usp=sharing
