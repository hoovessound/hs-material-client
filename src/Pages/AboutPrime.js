import React from 'react';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

export default class AboutPrimePage extends React.Component {
  render(){
    return (
      <div id="aboutPrime" 
        stlye={{
          textAlign: 'center',
        }}
      >
      <Typography component="h1" style={{fontSize: '1.5em'}}>HoovesSound Prime</Typography>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography >Why Prime? Why it is good for me tho?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            You will get a lot of benefits, including

            <ul>
              <li>Unlimited online music streaming</li>
              <li>A unique HoovesSound Prime badge</li>
            </ul>
            Much more is coming on the pipe line...
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography >Let talk about the moneyyy</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            How much does a Prime membership cost? <br />
            Just 5 HKD pre month (would you believe that, so cheap yay)
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography >Is it a one time thing?(Dirty~</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nope, as mentioned above, HoovesSound Prime <br />
            is a monthly subscription, once you have stop paying for your prime membership<br />
            you will lost all your prime functionality, but the special prime badge will still remain
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography >Sounds good, when can I start paying for it?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            For the currect stage, we only accept PayPal as our payment system<br />
            For the sake of you online banking security <br />
            We believe that PayPal is one of the world most secure online banking and transaction platform ever
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Typography>
        PS: HoovesSound is still on beta state, so all users will have Prime features anyways lol
      </Typography>
      </div>
    )
  }
}