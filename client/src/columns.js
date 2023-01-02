import { getText } from "./utils/getText";
import Slider from "react-slick";
import moment from "moment";



export const COLUMNS = [
  {
    Header: "review_name",
    accessor: "reviewName",
  },
  {
    Header: "reviewed_piece",
    accessor: "reviewedPiece",
  },
  {
    Header: "group",
    accessor: "group",
  },
  {
    Header: "tags",
    accessor: "tags",
    Cell: ({ value }) =>
      value
        .split(",")
        .map((item) => `#${item}`)
        .join(","),
  },
  {
    Header: "review_text",
    accessor: "reviewText",
    Cell: ({ value }) =>
      getText(value).length > 40
        ? getText(value).substring(0, 40) + "..."
        : getText(value),
  },
  {
    Header: "images",
    accessor: "reviewImages",
    Cell: ({ value }) => (
      <Slider slidesToShow={1} autoplay autoplaySpeed={2000}>
        {value.map((val) => (
          <img className="miniImg" src={val.img} alt="" />
        ))}
      </Slider>
    ),
   disableSortBy:true,
   disableFilters:true
  },

  {
    Header: "grade",
    accessor: "grade",
  },
  {
    Header: "average_rating",
    accessor: "averageRating",

  },

  {
    Header: "ratings_count",
    accessor: "ratingsCount",
   
  },
  {
    Header: "likes_count",
    accessor: "likesCount",

  },
  {
    Header: "comments_count",
    accessor: "commentsCount",

  },

  {
    Header: "created_at",
    accessor: "createdAt",
    Cell: ({ value }) => moment(value).format("L"),
  },
];
