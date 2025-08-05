// utils/formatDate.ts
import moment from "moment";

export function formatDateTime(iso: string) {
  return moment(iso).format("dddd, MMMM Do YYYY [at] HH:mm");
}

export function formatDate(iso: string) {
  return moment(iso).format("dddd, MMMM Do YYYY");
}

export function formatTime(iso: string) {
  return moment(iso).format("HH:mm");
}
