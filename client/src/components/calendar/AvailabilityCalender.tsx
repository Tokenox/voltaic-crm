import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import CustomModal from '../modals/CustomModal';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import createAbortController from '../../utils/createAbortController';
import { availabilityLoading, availabilitySelector } from '../../redux/slice/availabilitySlice';
import { createAvailability, deleteAvailability, getAvailability } from '../../redux/middleware/availability';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface CalendarProps {
  value: string;
  getActionData: (value: string, name: string) => void;
}

export type AvailabilityPlanState = {
  events: Array<any>;
  startDate: string;
  endDate: string;
  clickedEvent: object;
};

const initialState: AvailabilityPlanState = {
  events: [],
  startDate: null,
  endDate: null,
  clickedEvent: {}
};

const localizer = momentLocalizer(moment);

const WeekCalender = ({ value, getActionData }: CalendarProps) => {
  const dispatch = useAppDispatch();
  const { data: availability, events } = useAppSelector(availabilitySelector);
  const loading = useAppSelector(availabilityLoading);
  const { signal, abort } = createAbortController();
  const [addFormValues, setAddFormValues] = React.useState<AvailabilityPlanState>(initialState);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>('');
  const [eventSelected, setEventSelected] = useState({ eventSelect: '' });
  const [error, setError] = React.useState<{ title: string; description: string }>({
    title: '',
    description: ''
  });

  useEffect(() => {
    (async () => {
      await dispatch(getAvailability({ signal }));
    })();

    return () => {
      abort();
    };
  }, []);

  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date()
    }),
    []
  );

  const handleClose = () => {
    setIsModalOpen(false);
    setIsEventOpen(false);
  };
  const handleSelectedSlot = useCallback(({ start, end, box, nativeEvent }) => {
    const boundingBox = box;
    setSelectedSlot({ start, end, boundingBox });
    setIsModalOpen(true);
    setAddFormValues({ ...addFormValues, startDate: start, endDate: end });
  }, []);

  const setNewAavailability = () => {
    const { startDate, endDate } = addFormValues;
    const unavailability = { startDate, endDate };
    const event = addFormValues.events.slice();
    event.push(unavailability);
    setAddFormValues({ ...addFormValues, events: event });
  };

  const deleteAvailabilitySlot = async (eventId) => {
    await dispatch(deleteAvailability({ id: eventId }));
    setIsEventOpen(false);
    await dispatch(getAvailability({ signal }));
  };

  const handleSelectedEvent = useCallback((event) => {
    setAddFormValues({
      ...addFormValues,
      clickedEvent: event,
      startDate: event.start,
      endDate: event.end
    });
    setEventId(event.id);
    setIsEventOpen(true);
  }, []);

  //! submit planner form
  const submitAvailability = async () => {
    setNewAavailability();
    const data = {
      startTime: new Date(addFormValues.startDate).getTime(),
      endTime: new Date(addFormValues.endDate).getTime()
    };
    await dispatch(createAvailability({ availability: data }));
    await dispatch(getAvailability({ signal }));
    setIsModalOpen(false);
  };

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event && {
        style: {
          backgroundColor: '#DCDCDC',
          color: '#000'
        }
      })
    }),
    []
  );

  const slotGroupPropGetter = useCallback(
    () => ({
      style: {
        minHeight: 60
      }
    }),
    []
  );

  return (
    <Box>
      <Calendar
        localizer={localizer}
        events={events}
        timeslots={2}
        startAccessor="start"
        endAccessor="end"
        defaultDate={defaultDate}
        views={['week']}
        defaultView={Views.WEEK}
        style={{ height: 500 }}
        dayLayoutAlgorithm="no-overlap"
        selectable={true}
        eventPropGetter={eventPropGetter}
        slotGroupPropGetter={slotGroupPropGetter}
        onSelectEvent={(event) => handleSelectedEvent(event)}
        onSelectSlot={(slotInfo) => handleSelectedSlot(slotInfo)}
      />

      <CustomModal open={isModalOpen} setOpen={setIsModalOpen} size="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: '50px', color: '#f3ab65' }} />
          <p>Are you sure to mark this Time Slot as Unavailable?</p>
          <Box
            sx={{
              display: 'flex',
              gap: '30px',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              sx={{
                color: '#ffffff',
                backgroundColor: '#C04000',
                '&:hover': {
                  color: '#C04000'
                },
                borderRadius: '6px',
                paddingX: '24px'
              }}
              onClick={handleClose}
              autoFocus
            >
              Cancel
            </Button>
            {loading ? (
              <Button autoFocus>
                <CircularProgress size="18px" sx={{ color: '#4F7942' }} />
              </Button>
            ) : (
              <Button
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#4F7942',
                  '&:hover': {
                    color: '#4F7942'
                  },
                  borderRadius: '6px',
                  paddingX: '24px'
                }}
                onClick={submitAvailability}
                autoFocus
              >
                Confirm
              </Button>
            )}
          </Box>
        </Box>
      </CustomModal>
      <CustomModal open={isEventOpen} setOpen={setIsEventOpen} size="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: '50px', color: '#f3ab65' }} />
          <p>Are you sure to delete this unavailable Time Slot?</p>
          <Box
            sx={{
              display: 'flex',
              gap: '30px',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              sx={{
                color: '#ffffff',
                backgroundColor: '#4F7942',
                '&:hover': {
                  color: '#4F7942'
                },
                borderRadius: '6px',
                paddingX: '24px'
              }}
              onClick={handleClose}
              autoFocus
            >
              Cancel
            </Button>

            {loading ? (
              <Button autoFocus>
                <CircularProgress size="18px" sx={{ color: '#4F7942' }} />
              </Button>
            ) : (
              <Button
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#C04000',
                  '&:hover': {
                    color: '#C04000'
                  },
                  borderRadius: '6px',
                  paddingX: '24px'
                }}
                onClick={(event) => deleteAvailabilitySlot(eventId)}
                autoFocus
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default WeekCalender;

type ActionTypes = {
  id: number;
  name: string;
  value: string;
};

const ACTIONS: ActionTypes[] = [
  {
    id: 1,
    name: 'Schedule Unvaiability',
    value: 'availability'
  }
];
