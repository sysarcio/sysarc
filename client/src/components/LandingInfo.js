import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Typist from 'react-typist';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: 'theme.palette.common.white',
    },
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  cardHeader: {
    backgroundColor: '#49cc90',
  },
  cardLanding:
  {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'baseline',
    marginBottom: theme.spacing.unit * 2,
  },
  cardActions: {
    raised: true,
    opacity: 0.5,
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing.unit * 6,
    },
  },
  footer: {
    marginTop: theme.spacing.unit * 10,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
});

const tiers = [
  {
    title: 'collobrate',
    price: 'Live Collaboration',
    description: ['Minimize design refactoring', 'Fast architecture protoyping'],
  },
  {
    title: 'Generate Documentation',
    price: 'Generate Documentation',
    description: ['Swagger compliant documentation', 'See all endpoints and methods'],
   
  },
  {
    title: 'Enterprise',
    price: 'Visualize Data Flow',
    description: [
      'Update multiple applications',
      'Instantly see endpoint relationships',
    ],
  
  },
];


function Landing(
  props) {
  const { classes } = props;
  const cardDescription = {
    fontSize: '14px', 
    textAlign: 'left',
    color: '#394256'
  }
  const cardTitle = { fontSize: '35px' }

  const grid = {
    marginTop: '10px'
  }

  const appBenefit = {
    marginTop: '200px',
    marginBottom: '30px',
    fontSize: '25px',
    color: 'white',
    padding: '10px 40px'
  }

  return (
    <React.Fragment>
      <CssBaseline />
 
      <main className={classes.layout}>
        {/* Hero unit */}
        <div className={classes.heroContent}>
        
         

          <Typography style={appBenefit} variant="h6" align="center" color="textSecondary" component="p">
            We take the tedious design process out of the equation so you can focus on building your system architecture quickly and accurately
        
          </Typography>
        </div>
        {/* End hero unit */}
        <Grid style={grid} container spacing={40} alignItems="flex-end">
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title !== 'Enterprise' ? 12 : 6} md={4}>
              <Card >
                <CardHeader
                  
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  // action={tier.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardLanding}
                  >
                    <Typography variant="h3" style={cardTitle}>
                      {tier.price}
                    </Typography>
                    
                  </div>
           
                  {tier.description.map(line => (
                    <Typography variant="subtitle1" align="center" key={line} style={cardDescription}>
                      {line}
                    </Typography>
                  ))}
                
                </CardContent>
                
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
      
    </React.Fragment>
  );
}

Landing.
  propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Landing)
  ;