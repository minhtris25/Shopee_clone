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
        Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('order_id');
        $table->enum('payment_method', ['cod', 'shopeepay', 'bank_transfer']);
        $table->decimal('amount', 12, 2);
        $table->enum('payment_status', ['pending', 'completed', 'failed'])->default('pending');
        $table->dateTime('paid_at'); // hoặc tên cột khác tùy ý
        $table->timestamps();

        $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
