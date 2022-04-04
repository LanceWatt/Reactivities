import React, { Fragment, useEffect, useState } from 'react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { Container } from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]); // useState = React Hook
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [deleteActivity, setDeleteActivity] = useState<Activity | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {

      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0]; // Get the first part of the split array (date, not time)
        activities.push(activity);
      })

      setActivities(activities); // agent will hold activities
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id)); // x is variable that will hold the activity object
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  // if id is populated then use handleSelectActivity(id), else use handleCancelSelectActivity()
  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity(); // sets activity to undefined
    setEditMode(true);
  }
  //  if editing an activity and  click on cancel, then go back to ActivityDetails open component
  function handleFormClose() {
    setEditMode(false);
  }

  // loops through, changes activities array to be all but the one returning the id
  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })


  }

  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  if (loading) return <LoadingComponent content='Loading app' />

  return (

    <Fragment>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </Fragment>

  );
}

export default App;
