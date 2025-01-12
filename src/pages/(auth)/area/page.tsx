"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Geolocation } from '@capacitor/geolocation';

import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";

import { Suspense, useEffect, useRef, useState } from "react";
import { getAreaByLocation, profile, updateLocation, updatePhoneDetail, updatePreferredTime, updateProfileUrl } from "@/providers/logged-in/account.service";
import { errorMessage, langContent, useQuery } from "@/utils/common";
 
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { useTranslation } from "react-i18next";
import { page, track } from "@/providers/analytics.service";
import { getPlacePredictions, placeDetail } from "@/providers/logged-in/google-map.service";
import { FormSelect } from "@/components/ui/form-select";
import { Country } from "@/models/country";
import { Area } from "@/models/area";
import { alertDialog } from "@/hooks/use-alert-dialog";
import Loading from "./loading";
import { useIonRouter } from "@ionic/react";
import { Script } from "@/utils/script";


export default function AreaPage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();

  const { t } = useTranslation();
  let query = useQuery();
  
  const [places, setPlaces] = useState<any[]>([]);
 
  const placeholders : {
    [key: string]: string;
  } = {
    'Kuwait' : 'Mishref / Salmiya / Jabriya / etc.',
    'Bahrain' : 'Manama / Riffa / Muharraq / etc.',
    'KSA': 'Riyadh / Jeddah / Mecca / etc.',
    'Saudi Arabia': 'Riyadh / Jeddah / Mecca / etc.',
    'UAE': 'Dubai / Abu Dhabi / Sharjah / etc.',
    'United Arab Emirates': 'Dubai / Abu Dhabi / Sharjah / etc.',
    'Qatar': 'Doha / Al Rayyan Municipality/ Al Wakrah / etc.',
  }
 
  const countryOptions = [
    { key: 'Kuwait', value: langContent('Kuwait', 'الكويت') },
    { key: 'Bahrain', value: langContent('Bahrain', 'البحرين') },
    { key: 'Saudi Arabia', value: langContent('Saudi Arabia', 'المملكة العربية السعودية') },
    { key: 'United Arab Emirates', value: langContent('United Arab Emirates', 'الإمارات العربية المتحدة') },
    { key: 'Qatar', value: langContent('Qatar', 'دولة قطر') },
    ];

   // const searchInput = useRef<HTMLInputElement>(null);
   const formSchema = z.object({
      area_uuid: z.string({
          required_error: t('Please select your location')
      }).min(1, t('Please select your location')),
      latitude: z.string({    
          required_error: t('Please select your location')
      }).min(1, t('Please select your location')), 
      longitude: z.string({
          required_error: t('Please select your location')
      }).min(1, t('Please select your location')),
      country_name: z.string({
      }),
      query: z.string({
      }),
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country_name: langContent(user?.country?.country_name_en, 
        user?.country?.country_name_ar),
      query: langContent(user?.area?.area_name_en, 
            user?.area?.area_name_ar),  
      area_uuid: user?.candidate_area_uuid || "",
      latitude: user?.candidate_latitude || "",
      longitude: user?.candidate_longitude || "",    
    },
  })

  useEffect(() => {

    page('Area Page');

    /*if (match && match.params.fromProfile)
      //router.prefetch('/profile');
    else
      //router.prefetch('/personal-info-complete');*/

    return () => {
      track('page_exit', { page: 'Area Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('country_name', langContent(res?.country?.country_name_en, 
            res?.country?.country_name_ar));
        form.trigger('country_name');    
        form.setValue('area_uuid', res.candidate_area_uuid || "");
        form.trigger('area_uuid');
        form.setValue('latitude', res.candidate_latitude || "");
        form.trigger('latitude');

        form.setValue('longitude', res.candidate_longitude || "");
        form.trigger('longitude');

        form.setValue('query', langContent(res?.area?.area_name_en, 
            res?.area?.area_name_ar));
        form.trigger('query');  
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateLocation(values).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidate_area_uuid: values.area_uuid,
            candidate_latitude: values.latitude,
            candidate_longitude: values.longitude,
            area: res.area,
            country: res.country, 
            country_id: res.country_id,
          } }));
        }

        if (query.get('fromProfile')) 
          router.push('/profile');
        else
          router.push('/personal-info-complete');
      } else {
        alertDialog({
          title: t("Error"),
          description: errorMessage(res.message),
        });
      }
    }).finally(() => {
      setLoading(false);
    });
  } 

  /**
   * Return search result
   * @param ev
   */
  const getItems = async ( ) => {

    const { query, country_name } = form.getValues();

    console.log("getItems query", query);

    if (query.length == 0) {
      setPlaces([]);
      return;
    }

    setLoading(true);
    
    getPlacePredictions(query, country_name).then(result => {
        setLoading(false);

      if (!result || result.length == 0) {
        return null;
      }

      setPlaces([]);

      let a = [];
      let filteredPlaces = [];

      // political
      for (const i of result) {

        if (i.types.indexOf('country') > -1) {
          continue;
        }

        // to avoid duplicate

        const b = i.structured_formatting.main_text + i.terms[i.terms.length - 1].value;

        if (a.indexOf(b) > -1) {
          continue;
        }

        a.push(b);

        // show place to user

        filteredPlaces.push(i);
      }

      setPlaces(filteredPlaces);
    });
  }

  /**
   * Place selected from search result
   * @param place
   */
  function placeSelected(place: any) {
 
    setLoading(true); 

    placeDetail(place).then((result: any) => {

        setLoading(false);  

      if (result.operation == 'success') {
        setArea(result.country, result.area, result.area.area_latitude, result.area.area_longitude);
      }
      else
      {
        alertDialog({
          title: t("Error"),
          description: errorMessage(result.message),
        });
      }
    }).finally(() => {
        setLoading(false);  
    });
  }

  function getUserLocation() {

    const locationOptions = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };

    Geolocation.getCurrentPosition(locationOptions).then((resp: any) => {
      if (resp && resp.coords) {
        areaByLocation(resp.coords.latitude, resp.coords.longitude);
      }
    }).catch((error: any) => {
      alertDialog({
        title: t("Error"),
        description: error,
      });
    });
  }

  function areaByLocation(latitude: number, longitude: number, area = null) {

    setLoading(true);

    getAreaByLocation(latitude, longitude, area).then((result: any) => {

        setLoading(false); 

      if (result.operation == 'success' && result.area) {

        setArea(result.country, result.area, latitude, longitude);

      } else {
        alertDialog({
          title: t("Error"),
          description: result.message,
        });
      }
    }).finally(() => {
        setLoading(false); 
    });
  }

  function setArea(country: Country, area: Area, latitude: number, longitude: number) {

    if(!country || !area) {
      return null;
    }

    setPlaces([]);

    // reset search
    form.setValue('query', langContent(area.area_name_en, area.area_name_ar));
    form.trigger('query');

    /*this.area = area;

    this.country = country;

    if (
        area.area_name_en &&
        country.country_name_en
    ){
      setSelected(true);
    }*/

    form.setValue('country_name', langContent(country.country_name_en, country.country_name_ar));
    form.trigger('country_name');
    form.setValue('area_uuid', area.area_uuid || ''); 
    form.trigger('area_uuid');
    form.setValue('latitude', latitude + '');
    form.trigger('latitude');
    form.setValue('longitude', longitude + '');
    form.trigger('longitude');

    //save changes

   // this.submit();
  }

  function onCountryChange(e: any) {
   
    setPlaces([]);

    form.setValue('area_uuid', "");
    form.trigger('area_uuid');
    form.setValue('query', "");
    form.trigger('query');    
    form.setValue('latitude', "");
    form.trigger('latitude');
    form.setValue('longitude', "");
    form.trigger('longitude');
    form.setValue('country_name', e);
    form.trigger('country_name');
    /*setTimeout(() => {
      if(this.searchInput)
        this.searchInput.setFocus();
    }, 500);*/

    //form.trigger();

    console.log('onCountryChange', form)
  }

  return (
    <Suspense fallback={<Loading />}> 
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[88, 0, 0]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-0 text-center text-[40px] font-bold leading-[56px]">
           { t("In which area do you currently live?") }
        </h5>
 
        <p className="text-[#4B4B61] text-center text-base font-normal leading-6 mb-[40px] mt-[8px]">
            { t("This will help us link you to jobs that are close to where you live") }</p>

        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
        
            { /*form.getValues().area_uuid.length == 0 && <> */}
                <FormSelect
                    name="country_name"
                    label="Select country"
                    form={form as any}
                    options={countryOptions}
                    onChange={(e: any) => onCountryChange(e)}
                />
                    
                <FormInput
                    name="query"
                    //label="Profile Url"
                    form={form as any}
                    type="text"
                    label={getPlaceholderText()}
                    onChange={() => setTimeout(() => getItems(), 500)}
                    />
             
                { !loading && places.length > 0 && <div className="border border-gray-300 rounded-lg overflow-hidden">
                    { places.map((place, index) => (
                        <div key={index} className="p-4 border-b border-gray-300 cursor-pointer"
                            onClick={() => placeSelected(place)}>
                            { /*<img src="/assets/images/ic_location.svg" className="w-6 inline me-2" />&nbsp;&nbsp;*/}
                            { place.structured_formatting.main_text } 
                            <div className="text-sm">{ place.structured_formatting.secondary_text }</div>
                        </div>
                    ))}
                </div> }
 
            <SubmitButton disabled={!form.formState.isValid || loading } 
                loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>

        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBSM8o4WSIIRn-sNhn-PvO2s0ovZuLDAaw&libraries=places" // Replace with your script URL
          strategy="lazyOnload" // Load the script after the page has loaded
          onLoad={() => {
            console.log('google places loaded');
         }}
        />
    </Suspense>
  );

  function getPlaceholderText() {
    const country = form.getValues().country_name as string;
    return placeholders[country] || t('Select Area');
  }
}
