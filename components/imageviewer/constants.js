export const pdfpagewidth = 612;
export const pdfpageheight = 792;
export const multiplephotosimgtag = `<div style="width: ${pdfpagewidth} ; height: ${pdfpageheight} ;"><img src="#URI#" /></div>`;
export const multiplephotoshtml = `
<html>
  <head>
    <title>#TITLE#</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    #IMGTAGS#
  </body>
</html>
`;

export const filePrintOptions = {
  width: pdfpagewidth,
  height: pdfpageheight,
};

export const temporaryimgurl =
  "https://daclen.com/img/foto-watermark/1687854257FLYER PRODUCT 3_page-0005.jpg";
