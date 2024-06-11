// 가격 표시 포맷
export const currencyFormat = (value) => {
  const number = value !== undefined ? value : 0;
  return number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

// 카드 expires 형식 포맷
export const cc_expires_format = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      "" // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      "0$1" // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      "0" // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1/$2" // To handle 113 > 11/3
    );
};

// 날짜 시간 포맷
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} (${hours}시 ${minutes}분)`;
}

// 최신 순 정렬
export const SortByLatest = (list) => {
  const LatestList = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return LatestList
}