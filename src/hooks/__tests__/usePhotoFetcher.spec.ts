import usePhotoFetcher from '../usePhotoFetcher'
import { renderHook } from '@testing-library/react-hooks'
import { Basic } from 'unsplash-js/dist/methods/users/types';
import { ApiResponse } from 'unsplash-js/dist/helpers/response';

type NonEmptyArray<T> = [T, ...T[]];
type ReducedPhotoApiResult = Pick<Basic, 'id' | 'name'>[]
type PhotosApiResponse = ApiResponse<ReducedPhotoApiResult>
type ReducedPhotoApiResponse = Pick<PhotosApiResponse, 'type'  | 'errors'> & {
  response?: {
    results: never | ReducedPhotoApiResult,
    total_pages: number
  }
}

const photosResponse: ReducedPhotoApiResponse  = {
  type: 'success',
  response: { results: [], total_pages: 0 },
}
const mockgetPhotos = jest.fn<Promise<ReducedPhotoApiResponse>, never>()
  .mockReturnValue(Promise.resolve(photosResponse))

jest.mock('unsplash-js', () => {
	return {
		createApi: () => ({
      search: { getPhotos: mockgetPhotos }
    })
	}
})
jest.mock('../useDebounceState', () => ({ __esModule: true, default: (value: unknown) => value }))

const testPhotos = [
  { id: 'abc123', name: 'first.png'},
  { id: 'defg123', name: 'second.png'}
]
const testErrors: NonEmptyArray<string> = ['An internal error has occurred.']

describe('UsePhotoFetcher', () => {
	it('exposes fetched photos with initial query', async () => {
    mockUnsplashSuccessResponse(testPhotos)

		const { result, waitForNextUpdate } = renderPhotoFetcher('first query')
    await waitForNextUpdate()

    expect(result.current.photos).toEqual(testPhotos)
	})

  it('exposes errors when fetch request fails', async () => {
    mockUnsplashFailedResponse(testErrors)

		const { result, waitForNextUpdate } = renderPhotoFetcher('first query')
    await waitForNextUpdate()

    expect(result.current.errors).toEqual(testErrors)
  })

  it('clears existing photos when a new request fails', async () => {
    mockUnsplashSuccessResponse(testPhotos)
		const { result, rerender ,waitForNextUpdate } = renderPhotoFetcher('first query')
    await waitForNextUpdate()

    mockUnsplashFailedResponse(testErrors)
    rerender({ query: 'second query' })
    await waitForNextUpdate()

    expect(result.current.photos).toEqual([])
  })

  it('clears existing errors when a new request success', async () => {
    mockUnsplashFailedResponse(testErrors)
		const { result, rerender ,waitForNextUpdate } = renderPhotoFetcher('first query')
    await waitForNextUpdate()

    mockUnsplashSuccessResponse(testPhotos)
    rerender({ query: 'second query' })
    await waitForNextUpdate()

    expect(result.current.errors).toEqual([])
  })
})

function renderPhotoFetcher(initialQuery: string) {
  return renderHook(
    ({ query }) => usePhotoFetcher(query),
    { initialProps: { query: initialQuery }}
  )
}

function mockUnsplashSuccessResponse(results: ReducedPhotoApiResult, totalPages = 10) {
  mockgetPhotos.mockReturnValue(
    Promise.resolve({
      type: 'success',
      response: {
        results,
        total_pages: totalPages
      }
    })
  )
}

function mockUnsplashFailedResponse(errors: NonNullable<PhotosApiResponse['errors']>) {
  photosResponse.type = 'error'
  photosResponse.errors = errors
  mockgetPhotos.mockReturnValue(
    Promise.resolve({
      type: 'error',
      errors
    })
  )
}
