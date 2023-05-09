// import DOMParser from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import {
  DOMParser,
  Element,
} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  crawl('https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot')
}

// function that crawls a url and grabs the images
async function crawl(url: string) {
  // get the html of the url
  const res = await fetch(url)
  const html = await res.text()

  // parse the html
  const doc = new DOMParser().parseFromString(html, 'text/html')

  // get all the images
  const images = doc.querySelectorAll('img')

  const first_image = images[0] as Element
  const image_src: string[] = []

  // loop through images and convert array elements to Element objects
  images.forEach((image) => {
    image as Element
  })
  images.forEach((image) => {
    image_src.push(image.getAttribute('src'))
  })

  // keep only elements in image_src that have the string 'upload.wikimedia.org/wikipedia/commons/thumb' in them
  let filtered_image_src = image_src.filter((src) => {
    return src.includes('upload.wikimedia.org/wikipedia/commons/thumb')
  })
  // remove prepended '//' from each element in filtered_image_src
  filtered_image_src = filtered_image_src.map((src) => {
    return src.slice(2)
  })
  // remove first 2 elements from filtered_image_src
  filtered_image_src = filtered_image_src.slice(2)
  // remove last 3 elements from filtered_image_src
  filtered_image_src = filtered_image_src.slice(0, -3)
  // remove 'thumb/' from each element in filtered_image_src
  filtered_image_src = filtered_image_src.map((src) => {
    return src.replace('thumb/', '')
  })
  // remove text after first '.jpg' from each element in filtered_image_src
  filtered_image_src = filtered_image_src.map((src) => {
    return src.split('.jpg')[0] + '.jpg'
  })
  // add 'https:' to each element in filtered_image_src
  filtered_image_src = filtered_image_src.map((src) => {
    return 'https://' + src
  })

  // make sure the images folder exists, and if not, create it
  try {
    await Deno.mkdir('images')
  } catch (err) {
    if (err instanceof Deno.errors.AlreadyExists) {
      console.log('images folder already exists')
    } else {
      throw err
    }
  }

  // save each image to a folder
  filtered_image_src.forEach(async (src) => {
    const image = await fetch(src)
    const image_data = await image.arrayBuffer()
    const image_buffer = new Uint8Array(image_data)
    const image_name = src.split('/').slice(-1)[0]
    await Deno.writeFile('images/' + image_name, image_buffer)
  })

  console.log(filtered_image_src)
}
