import { RULE_CATEGORIES, Schedule } from "../database";

export const toCalendarDay = (date: Date) => date.toISOString().split('T')[0];

export const isBefore = (date1: Date, date2: Date) => date1.getTime() < date2.getTime();

export const getToday = () => new Date(toCalendarDay(new Date()));

type DatesArr = [ string, string | undefined];
export const getDatesFromLastWatered = ({rangeEnd, ruleNumber, ruleCategory}: Schedule, lastWatered: string): DatesArr => {
  let daysBetweenLastWateredAndStart = ruleNumber;
  if (ruleCategory === RULE_CATEGORIES.WEEKS) {
    daysBetweenLastWateredAndStart = daysBetweenLastWateredAndStart * 7;
  }

  let startDate = new Date(lastWatered);
  startDate.setDate(startDate.getDate() + daysBetweenLastWateredAndStart)
  if (isBefore(startDate, getToday())) {
    startDate = getToday();
  }

  let endDate;
  if (rangeEnd) {
    let daysBetweenStartAndEnd = rangeEnd - ruleNumber;
    if (ruleCategory === RULE_CATEGORIES.WEEKS) {
      daysBetweenStartAndEnd = daysBetweenStartAndEnd * 7;
    }

    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysBetweenStartAndEnd);
  }

  return [
    toCalendarDay(startDate), 
    endDate ? toCalendarDay(endDate) : endDate
  ];
}