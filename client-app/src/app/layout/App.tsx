import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]); // useState = React Hook
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [deleteActivity, setDeleteActivity] = useState<Activity | undefined>(undefined);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/activities').then(response => {
      setActivities(response.data); // data will hold activities
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
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    // if do have activity.id, then we know to update it, otherwise
    activity.id
      // spread operator to loop over our existing activities and then filter, then pass in newly updated activity
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, { ...activity, id: uuid() }]); // we dont have id, so create new activity
    setEditMode(false);
    setSelectedActivity(activity);
  }

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
        />
      </Container>
    </Fragment>

  );
}

export default App;
