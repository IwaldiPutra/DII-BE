function getDatesByDay(start, end, day) {
  const daysMap = {
    minggu: 0,
    senin: 1,
    selasa: 2,
    rabu: 3,
    kamis: 4,
    jumat: 5,
    sabtu: 6,
  };

  const targetDay = daysMap[day.toLowerCase()];
  if (targetDay === undefined) return [];

  const result = [];
  let current = new Date(start);
  const endDate = new Date(end);

  console.log(current.getDay() + " " + targetDay);

  while (current <= endDate) {
    if (current.getDay() === targetDay) {
      result.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return result;
}

module.exports = { getDatesByDay };
