export class Post {
    constructor(
      public headline: string,
      public postType: string,
      public featuredImage: string, //id
      public publishDate: Date,
      public published: Boolean,
      public publishedBy: string, //id
      public subHeadline?: string,
      public body?: any[]
    ) {  }
}