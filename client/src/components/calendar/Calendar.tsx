import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import HistoryIcon from '@mui/icons-material/History';
import CampaignIcon from '@mui/icons-material/Campaign';
import CustomModal from '../modals/CustomModal';
import PlannerForm from '../planner-form/PlannerForm';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { createPlanner, deletePlanner, getPlanners } from '../../redux/middleware/planner';
import { plannerLoading, plannerSelector } from '../../redux/slice/plannerSlice';
import createAbortController from '../../utils/createAbortController';
import { getCategories } from '../../redux/middleware/category';
import { CategoryResponseTypes, SocialActionClient } from '../../types';
import { categorySelector } from '../../redux/slice/categorySlice';

interface CalendarProps {
  value: string;
  getActionData: (value: string, name: string) => void;
}

export type PlannerState = {
  title: string;
  description: string;
  action: SocialActionClient;
  startDate: Dayjs | null;
  timeOfExecution: Dayjs | null;
  source: string;
};

const initialState: PlannerState = {
  title: '',
  description: '',
  action: SocialActionClient.email,
  startDate: dayjs(new Date()),
  timeOfExecution: dayjs(new Date()),
  source: ''
};

export type PlannerModalState = {
  id: string;
  title: string;
  desc: string;
  action: string;
  source: string;
  startDate: string;
  endDate: string;
};

const initialModalState: PlannerModalState = {
  id: '',
  title: '',
  desc: '',
  action: '',
  source: '',
  startDate: null,
  endDate: null
};

const localizer = momentLocalizer(moment);

const MyCalendar = ({ value, getActionData }: CalendarProps) => {
  const dispatch = useAppDispatch();
  const { data: plannerData, events } = useAppSelector(plannerSelector);
  const loading = useAppSelector(plannerLoading);
  const categories: CategoryResponseTypes[] = useAppSelector(categorySelector);
  const { signal, abort } = createAbortController();

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [actionValue, setActionValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [plannerID, setPlannerID] = useState<string>('');
  const [isPlannerModalOpen, setPlannerIsModalOpen] = useState<boolean>(false);
  const [addFormValues, setAddFormValues] = React.useState<PlannerState>(initialState);
  const [modalPlannerData, setModalPlannerData] = React.useState<PlannerModalState>(initialModalState);
  const [error, setError] = React.useState<{ title: string; description: string }>({
    title: '',
    description: ''
  });

  console.log('events----------', events);

  useEffect(() => {
    (async () => {
      await dispatch(getPlanners({ signal }));
      await dispatch(getCategories({ signal }));
    })();

    return () => {
      abort();
    };
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6)
    }),
    []
  );
  const handleSelectSlot = useCallback(({ start, end, box, nativeEvent }) => {
    const boundingBox = box;
    setSelectedSlot({ start, end, boundingBox });
    setDropdownVisible(true);
    setAddFormValues({ ...addFormValues, startDate: dayjs(start) });
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setModalPlannerData({
      ...modalPlannerData,
      id: event.id,
      title: event.title,
      desc: event.desc,
      action: event.action,
      source: event.source,
      startDate: moment(event.start).toString(),
      endDate: moment(event.end).toString()
    });
    setPlannerID(event.id);
    setPlannerIsModalOpen(true);
  }, []);

  const deletePlannerEvent = async () => {
    await dispatch(deletePlanner({ id: plannerID }));
    setPlannerIsModalOpen(false);
    await dispatch(getPlanners({ signal }));
  };
  const closeDropdown = () => {
    // Close the dropdown
    setDropdownVisible(false);
  };

  const handleDropdownAction = (value) => {
    // Handle the action when an item in the dropdown is selected
    // For example, you can perform some action and then close the dropdown
    setActionValue('Schedule ' + value.toUpperCase());
    setAddFormValues({ ...addFormValues, action: value });
    setIsModalOpen(true);
    closeDropdown();
  };

  //! submit planner form
  const submitPlan = async () => {
    if (!addFormValues.title || !addFormValues.description) {
      setError({ title: 'Please enter title', description: 'Please enter description' });
      return;
    }

    const time = new Date(addFormValues.timeOfExecution?.format()).getTime();
    const data = {
      title: addFormValues.title,
      description: addFormValues.description,
      action: addFormValues.action,
      startDate: addFormValues.startDate.toDate().getTime(),
      timeOfExecution: time,
      source: addFormValues.source
    };
    const response = await dispatch(createPlanner({ planner: data }));
    if (!response.payload) return;
    setIsModalOpen(false);
    await dispatch(getPlanners({ signal }));
  };

  //! Dropdown
  const renderDropdown = () => {
    if (!selectedSlot || !selectedSlot.boundingBox) {
      return null;
    }

    const { x, y } = selectedSlot.boundingBox;
    const dropdownStyle: React.CSSProperties = {
      position: 'absolute',
      top: y,
      left: x,
      backgroundColor: 'white',
      boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 4
    };
    const itemStyle: React.CSSProperties = {
      fontWeight: 700,
      fontSize: '14px',
      fontFamily: 'math'
    };

    const getIcon = (value) => {
      switch (value) {
        case 'email':
          return <EmailIcon fontSize={'small'} htmlColor="#676666" />;
        case 'sms':
          return <SmsIcon fontSize={'small'} htmlColor="#676666" />;
        case 'post':
          return <SmsIcon fontSize={'small'} htmlColor="#bdbdbd" />;
        case 'story':
          return <HistoryIcon fontSize={'small'} htmlColor="#bdbdbd" />;
        case 'ad':
          return <CampaignIcon fontSize={'small'} htmlColor="#bdbdbd" />;
        default:
          return null;
      }
    };

    return (
      <div style={dropdownStyle}>
        {ACTIONS.map((action: ActionTypes) => (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              padding: '4px 0',
              cursor: action.value === 'email' || 'sms' ? 'pointer' : 'no-drop'
            }}
            onClick={() => {
              action.value === 'email' && handleDropdownAction(action.value);
              action.value === 'sms' && handleDropdownAction(action.value);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>{getIcon(action.value)}</div>
            <div
              style={{
                ...itemStyle,
                color: action.value === 'email' || 'sms' ? '#676666' : '#bdbdbd',
                marginTop: '2px'
              }}
            >
              {action.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Add Event
        </Button>
      </Box>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={defaultDate}
        defaultView={Views.MONTH}
        style={{ height: 500 }}
        selectable={true}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        scrollToTime={scrollToTime}
      />
      {dropdownVisible && renderDropdown()}
      <CustomModal title={actionValue} open={isModalOpen} setOpen={setIsModalOpen} handleSubmit={submitPlan} loading={loading}>
        <PlannerForm
          state={addFormValues}
          categories={categories}
          getFormData={({ name, value }) => {
            setAddFormValues({ ...addFormValues, [name]: value });
            if (name === 'title' && value) setError({ ...error, title: '' });
            if (name === 'description' && value) setError({ ...error, description: '' });
          }}
          error={error}
        />
      </CustomModal>
      <Dialog
        open={isPlannerModalOpen}
        onClose={() => {
          setPlannerIsModalOpen(false);
        }}
        sx={{ width: '100%' }}
      >
        <DialogTitle>{'Planner Detail'}</DialogTitle>
        <DialogContent sx={{ width: '100%', display: 'flex', gap: '20px' }}>
          <TextField
            disabled
            label="Title"
            defaultValue={modalPlannerData.title}
            InputProps={{
              readOnly: true
            }}
            variant="standard"
          />
          <TextField
            disabled
            label="Description"
            defaultValue={modalPlannerData.desc}
            InputProps={{
              readOnly: true
            }}
            variant="standard"
          />
        </DialogContent>
        <DialogContent sx={{ width: '100%', display: 'flex', gap: '20px' }}>
          <TextField
            disabled
            label="Start Date"
            defaultValue={modalPlannerData.startDate}
            InputProps={{
              readOnly: true
            }}
            variant="standard"
          />
          <TextField
            disabled
            label="Time of Execution"
            defaultValue={modalPlannerData.endDate}
            InputProps={{
              readOnly: true
            }}
            variant="standard"
          />
        </DialogContent>
        <DialogContent sx={{ width: '100%', display: 'flex', gap: '20px' }}>
          <TextField
            disabled
            label="Source"
            defaultValue={modalPlannerData.source}
            InputProps={{
              readOnly: true
            }}
            variant="standard"
          />
          <TextField
            disabled
            label="Action"
            defaultValue={modalPlannerData.action}
            InputProps={{
              readOnly: true
            }}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          {/* {loading ? (
            <Button autoFocus>
              <CircularProgress size="18px" sx={{ color: '#4F7942' }} />
            </Button>
          ) : (
            <Button
              color="error"
              onClick={async () => {
                await dispatch(deletePlanner({ id: modalPlannerData.id }));
                await dispatch(getPlanners({ signal }));
                setPlannerIsModalOpen(false);
              }}
            >
              Delete
            </Button>
          )} */}
          {loading ? (
            <Button autoFocus>
              <CircularProgress size="18px" sx={{ color: '#4F7942' }} />
            </Button>
          ) : (
            <Button
              onClick={() => {
                deletePlannerEvent();
              }}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={() => {
              setPlannerIsModalOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyCalendar;

type ActionTypes = {
  id: number;
  name: string;
  value: string;
};

const ACTIONS: ActionTypes[] = [
  {
    id: 1,
    name: 'Schedule Email',
    value: 'email'
  },
  {
    id: 2,
    name: 'Schedule Sms',
    value: 'sms'
  },
  {
    id: 3,
    name: 'Schedule Post',
    value: 'post'
  },
  {
    id: 4,
    name: 'Schedule Story',
    value: 'story'
  },
  {
    id: 5,
    name: 'Schedule Ad',
    value: 'ad'
  }
];
