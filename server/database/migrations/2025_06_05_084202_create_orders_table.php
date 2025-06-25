<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('buyer_id');
        $table->unsignedBigInteger('seller_id');
        $table->string('order_code');
        $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
        $table->text('shipping_address');
        $table->decimal('shipping_fee', 10, 2);
        $table->decimal('total_price', 12, 2);
        $table->enum('payment_method', ['cod', 'shopeepay', 'bank_transfer']);
        $table->enum('payment_status', ['unpaid', 'paid']);
        $table->timestamps();

        $table->foreign('buyer_id')->references('id')->on('users');
        $table->foreign('seller_id')->references('id')->on('users');
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
