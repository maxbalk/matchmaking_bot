# Fight Club GvG organization bot
# Development documentation

### Table of contents
  - [Introduction](#introduction)
  - [Overview](#overview)
    - [Match organization](#match-organization)
    - [Matchmaking - Role distribution](#matchmaking---role-distribution)
    - [Matchmaking - Player rating](#matchmaking---player-rating)
  - [Functional Requirements](#functional-requirements)
    - [Admin Commands](#admin-commands-dont-type-the-brackets)
    - [Participant Actions](#participant-actions)


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
### Admin Commands
1. `match-create <yyyy mm dd hh mm>`  
   - Creates a **match** event at the given date and time.  
   - Posts two match **match announcement messages** in the **match channel** 
2. `config-admin-channel <channel-name>`
   - Designates the channel to listen for admin commands
3. `config-match-channel <channel-name>`
   - Designates the channel where match announcements and updates will be posted.
4. `config-roles-add <role-name emoji-name>`
   - Adds a participant role for matches
5. `config-roles-remove <role-name emoji-name>`
   - Remove participant role
6. `config-roles-min <role-name min>`
   - Set the minimum role population parameter
7. `config-roles-max <role-name max>`
   - Set maximum role population parameter
8. `show-ratings`
   - Displays a list of all player ratings in the admin channel

### Participant Actions
1. Add reaction to **primary role** or **secondary role **announcement message
   - If this is a participant's first reaction, they are now **RSVP**d to the match and thus add to the total number of participants
   - Adds the given role to the list of that participant's primary or secondary roles for the match
   - Participants are not permitted to react to both primary and secondary role announcement messages with the same role

2. Remove reaction 
   - Removes a role from a participant's list of primary secondary roles
   - If both lists are now empty, the participant is no longer RSVPd to the match. Match population decreased by one

## Technical Specifications
### to be added
