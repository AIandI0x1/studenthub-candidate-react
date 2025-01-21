import { stopWork } from '@/providers/logged-in/account.service';
import { Candidate } from '@/models/candidate';
import { setUser } from '@/store/slices/userSlice';
import { startWork } from '@/providers/logged-in/account.service';
import { useAppSelector } from '@/store/store';
import { useAppDispatch } from '@/store/store';
import { errorMessage } from '@/utils/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { alertDialog } from '@/hooks/use-alert-dialog';

const WorkingCounter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user) as { user: Candidate };
    
  const [started, setStarted] = useState(user?.isWorking?.start_time);
/*
  useEffect(() => {
    if (authService.isLogin && authService.candidate && user?.isWorking) {
      setStarted(user?.isWorking.start_time);
    }

    const workStartedSubscription = eventService.workStarted$.subscribe(() => {
      accountStatus.checkWorkStatus().then((data: any) => {
        if (data) {
          setStarted(data.start_time);
        }
      });
    });

    const workStoppedSubscription = eventService.workStopped$.subscribe(() => {
      setStarted(null);
    });

    return () => {
      workStartedSubscription.unsubscribe();
      workStoppedSubscription.unsubscribe();
    };
  }, [authService, eventService, accountStatus]);*/

  const startWorkClicked = async () => {
    //eventService.startWork$.next({});
    try {
      if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 1200
          });
      });

      if (position?.coords) {
          const data = await startWork(position.coords.latitude, position.coords.longitude);

          if (data.operation === "success") {
              console.log('started');
              
              dispatch(setUser({ user: {
                  ...user,
                  isWorking: data.data
              }}));

             // workStarted$.next({});
          }

          alertDialog({
            title: data.operation === "success"? t('Success') : t('Error'),
            description: errorMessage(data.message),
          });
      }

    } catch (error) {
        alertDialog({
          title: t('Error'),
          description: t('Location permission required to start the work'),
        });
    }
  };

  const stopWorkClicked = async () => {
    //eventService.stopWork$.next({});
    try {
      if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 1200
          });
      });

      if (position?.coords) {
          const data = await stopWork(position.coords.latitude, position.coords.longitude);

          if (data.operation === "success") {
              dispatch(setUser({ user: {
                  ...user,
                  isWorking: null
              }}));

             // workStopped$.next({});
          } else {
            alertDialog({
              title: t('Error'),
              description: errorMessage(data.message),
            });
          }
      }

    } catch (error) {
      alertDialog({
        title: t('Error'),
        description: t('Location permission required to start the work')
      });
    }
  };

  return (
    <div className="flex">
      <div className="flex-grow">
        {!started && user?.store_id && (
          <button className="bg-blue-600 text-white font-semibold text-lg rounded-full px-4 py-2" onClick={startWorkClicked}>
            <i className="icon-radio-button-on-outline"></i>&nbsp;{t("Track")}
          </button>
        )}
        {started && (
          <button className="bg-red-600 text-white font-semibold text-lg rounded-full px-4 py-2" onClick={stopWorkClicked}>
            <i className="icon-radio-button-on-outline"></i>&nbsp;{started}
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkingCounter;