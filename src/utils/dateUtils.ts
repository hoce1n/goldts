import moment from 'moment-jalaali';

export const jalaliToGregorian = (jalaliDate: string): string | null => {
    try {
        const m = moment(jalaliDate, 'jYYYY/jM/jD');
        if (!m.isValid()) return null;
    
        return m.format('YYYY-MM-DD')
    } catch {
        return null;
    }
};

export const gregorianToJalali = (gregorianDate: string ): string => {
    if (!gregorianDate) return '-';

    try {
        return moment(gregorianDate, 'MM/DD/YYYY hh:mm:ss A').format('jYYYY/jMM/jDD');
    } catch {
        return '-';
    }
}