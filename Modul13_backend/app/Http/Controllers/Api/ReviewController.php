<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use App\Models\Contents;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $storeData = $request->all();

        $validate = Validator::make($storeData,[
            'comment' => 'required',
        ]);

        if ($validate->fails()) {
            return response(['message'=> $validate->errors()],400);
        }

        $idUser = Auth::user()->id;
        $user = User::find($idUser);
        $content = Contents::find($request->idContent);

        if($content->id_user === $user->id){
            return response([
                'message' => 'You are not allowed to review your own content'
            ],400);
        }

        if(is_null($user)){
            return response([
                'message' => 'User Not Found'
            ],404);
        }

        if(is_null($content)){
            return response([
                'message' => 'Content Not Found'
            ],404);
        }

        $storeData['id_user'] = $user->id;
        $storeData['id_content'] = $request->idContent;

        $review = Review::create($storeData);

        return response([
            'message' => 'Review Added Successfully',
            'data' => $review,
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $content = Contents::find($id);
        $reviews = Review::with(['user'])->where('id_content', $content->id)->get();

        if(is_null($reviews)){
            return response([
                'message' => 'Reviews Not Found',
                'data' => null
            ],404);
        }

        return response([
            'message' => 'Reviews Retrieved',
            'data' => $reviews,
        ],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $review = Review::find($id);

        if(is_null($review)){
            return response([
                'message' => 'Review Not Found',
                'data' => null
            ],404);
        }

        if($review->delete()){
            return response([
                'message' => 'Review Deleted Successfully',
                'data' => $review,
            ],200);
        }

        return response([
            'message' => 'Review Content Failed',
            'data' => null,
        ],400);
    }
}
