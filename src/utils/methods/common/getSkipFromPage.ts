interface GetSkipFromPageProps {
  page: number
  limit: number
}

export const getSkipFromPagination = ({ page, limit }: GetSkipFromPageProps) => {
  return (page - 1) * limit
}
