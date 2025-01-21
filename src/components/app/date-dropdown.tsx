// components/App/DateDropdown.jsx

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { dateTimeFormat } from '@/utils/common';

const DateDropdown = ({ min, max, placeholder, pickerFormat, position }: 
    { min: string, max: string, placeholder: string, pickerFormat: string, position: string }) => {
    
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [days, setDays] = useState<{ day: string, isSelectable: boolean, isSelected: boolean }[]>([]);
    const [months, setMonths] = useState<{ month: number, isSelectable: boolean, isSelected: boolean }[]>([]);
    const [years, setYears] = useState<{ year: number, isSelected: boolean }[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [minDate, setMinDate] = useState(new Date(min));
    const [maxDate, setMaxDate] = useState(new Date(max));

    useEffect(() => {
        init();
        initMonths();
        initYears();
    }, [min, max, value]);

    const init = () => {
        const actualDate = new Date(value || '') || new Date();
        const start = startOfMonth(actualDate);
        const end = endOfMonth(actualDate);

        const daysArray: { day: string, isSelectable: boolean, isSelected: boolean }[] = eachDayOfInterval({ 
            start, end 
        }).map(date => ({
            day: dateTimeFormat(date.toISOString(), 'd'),
            isSelectable: true,
            isSelected: value && isSameDay(date, new Date(value)) || false,
        }));

        setDays(daysArray);
    };

    const initMonths = () => {
        const selectedDateObj = new Date(value || '');
        const monthsArray = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            isSelectable: isDateSelectable(selectedDateObj.getFullYear() + '/' + (i + 1) + '/01'),
            isSelected: (i + 1) === selectedDateObj.getMonth() + 1,
        }));

        setMonths(monthsArray);
    };

    const initYears = () => {
        const range = maxDate.getFullYear() - minDate.getFullYear() + 1;
        const yearsArray = Array.from({ length: range }, (_, i) => ({
            year: minDate.getFullYear() + i,
            isSelected: (minDate.getFullYear() + i) === new Date(value || '').getFullYear(),
        }));

        setYears(yearsArray);
    };

    const isDateSelectable = (date: string) => {
        const timestamp = new Date(date).valueOf();
        return !(minDate && timestamp < minDate.valueOf()) && !(maxDate && timestamp > maxDate.valueOf());
    };

    const onDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const day = event.target.value;
        setSelectedDate(day);
        if (selectedMonth && selectedYear) {
            setValue(`${selectedYear}/${selectedMonth}/${day}`);
        }
    };

    const onMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const month = event.target.value;
        setSelectedMonth(month);
        if (selectedDate && selectedYear) {
            setValue(`${selectedYear}/${month}/${selectedDate}`);
            init(); // reset days
        }
    };

    const onYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value;
        setSelectedYear(year);
        if (selectedMonth && selectedDate) {
            setValue(`${year}/${selectedMonth}/${selectedDate}`);
        }
    };

    return (
        <div className={`flex flex-col ${position}`}>
            {pickerFormat && pickerFormat.includes('D') && (
                <select className="native-select" onChange={onDayChange}>
                    <option value="" disabled selected>{placeholder || 'DD'}</option>
                    {days.map((row) => (
                        <option key={row.day} value={row.day} disabled={!row.isSelectable}>
                            {row.day}
                        </option>
                    ))}
                </select>
            )}
            {pickerFormat && pickerFormat.includes('M') && (
                <select className="native-select" onChange={onMonthChange}>
                    <option value="" disabled selected>{placeholder || 'MM'}</option>
                    {months.map((row) => (
                        <option key={row.month} value={row.month} disabled={!row.isSelectable}>
                            {row.month}
                        </option>
                    ))}
                </select>
            )}
            <select className="native-select" onChange={onYearChange}>
                <option value="" disabled selected>{placeholder || 'yyyy'}</option>
                {years.map((row) => (
                    <option key={row.year} value={row.year}>
                        {row.year}
                    </option>
                ))}
            </select>
        </div>
    );
};

DateDropdown.propTypes = {
    min: PropTypes.string.isRequired,
    max: PropTypes.string.isRequired,
    presentation: PropTypes.string,
    placeholder: PropTypes.string,
    pickerFormat: PropTypes.string,
    position: PropTypes.string,
};

export default DateDropdown;

// Tailwind CSS styles are applied directly in the component